import { google, calendar_v3 } from "googleapis";
import { NotionTool } from "../tools/NotionTool"; // adjust path
import { GoogleToken } from "../models/GoogleToken";

export class GoogleCalendarTool {
  private static createOAuthClient(token: GoogleToken) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? undefined, // ✅ normalize null → undefined
      scope: token.scope || undefined,
      token_type: token.token_type || undefined,
      expiry_date: token.expiry_date ?? undefined,
    });

    return oAuth2Client;
  }

  // ✅ Get Google Calendar client for a user
  private static async getCalendarClient(user_id: string) {
    const token = await NotionTool.getGoogleToken(user_id);
    if (!token) {
      throw new Error(`No Google token found in Notion for user_id: ${user_id}`);
    }

    const auth = this.createOAuthClient(token);
    return google.calendar({ version: "v3", auth });
  }

  // ✅ List events
  static async listEvents(user_id: string, timeMin?: string, timeMax?: string) {
    const calendar = await this.getCalendarClient(user_id);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items || [];
  }

  // ✅ Create event
  static async createEvent(user_id: string, event: calendar_v3.Schema$Event) {
    const calendar = await this.getCalendarClient(user_id);

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return res.data;
  }

  // ✅ Update event
  static async updateEvent(user_id: string, eventId: string, updates: calendar_v3.Schema$Event) {
    const calendar = await this.getCalendarClient(user_id);

    const res = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: updates,
    });

    return res.data;
  }

  // ✅ Delete event
  static async deleteEvent(user_id: string, eventId: string) {
    const calendar = await this.getCalendarClient(user_id);

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return { success: true };
  }
}