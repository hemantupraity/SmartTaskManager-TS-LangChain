import { Request, Response } from "express";
import { google } from "googleapis";
import { NotionTool } from "../tools/NotionTool"; // adjust path

export class GoogleAuthController {
  private static oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // 1. Generate Auth URL
  static getAuthUrl = async (req: Request, res: Response) => {
    try {
      const user_id = req.query.user_id as string;
      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      const url = GoogleAuthController.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
        state: encodeURIComponent(user_id),
      });

      res.json({ url });
    } catch (error: any) {
      console.error("Error generating auth URL:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // 2. Handle Callback
  static handleOAuthCallback = async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const stateUserId =
        (req.query.user_id as string) ||
        (req.query.state ? decodeURIComponent(String(req.query.state)) : "");

      if (!code) {
        return res.status(400).json({ error: "Missing OAuth code" });
      }

      // Exchange code for tokens
      const { tokens } = await GoogleAuthController.oAuth2Client.getToken(code);

      if (!tokens || !tokens.access_token) {
        return res.status(400).json({ error: "Failed to get access token" });
      }

      // Attach credentials
      GoogleAuthController.oAuth2Client.setCredentials(tokens);

      // ✅ Fetch Google profile for correct user_id + email
      const oauth2 = google.oauth2({
        version: "v2",
        auth: GoogleAuthController.oAuth2Client,
      });
      const { data: profile } = await oauth2.userinfo.get();

      const user_id = profile.id || stateUserId; // fallback if Google ID missing
      const email = profile.email || "";

      // Save tokens in Notion
      await NotionTool.saveOrUpdateGoogleToken({
        user_id,
        email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope || "",
        token_type: tokens.token_type || "Bearer",
        expiry_date: tokens.expiry_date,
      });

      res.send("✅ Connected. You can close this tab.");
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // 3. Check Status
  static authStatus = async (req: Request, res: Response) => {
    try {
      const user_id = req.query.user_id as string;
      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      const tokenData = await NotionTool.getGoogleToken(user_id);
      if (!tokenData) {
        return res.json({ connected: false });
      }

      res.json({ connected: true, token: tokenData });
    } catch (error: any) {
      console.error("Auth status error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
