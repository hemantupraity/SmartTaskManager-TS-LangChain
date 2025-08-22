import { Client } from "@notionhq/client";
import { GoogleToken } from "../models/GoogleToken";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_GOOGLE_TOKENS_DB_ID as string;

export class NotionTool {
  // Save or Update Google Token
  static async saveOrUpdateGoogleToken(token: GoogleToken): Promise<void> {
    try {
      // Search existing record by user_id (Google ID stored in Title)
      const existing = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "user_id",
          title: {
            equals: token.user_id,
          },
        },
      });

      const now = new Date().toISOString();

      if (existing.results.length > 0) {
        // ✅ Update existing record
        const pageId = existing.results[0].id;
        console.log(`🔄 Updating token for user_id=${token.user_id}`);
        await notion.pages.update({
          page_id: pageId,
          properties: {
            email: { email: token.email || null },
            access_token: { rich_text: [{ text: { content: token.access_token } }] },
            refresh_token: token.refresh_token
              ? { rich_text: [{ text: { content: token.refresh_token } }] }
              : { rich_text: [] },
            scope: { rich_text: [{ text: { content: token.scope } }] },
            token_type: { rich_text: [{ text: { content: token.token_type } }] },
            expiry_date: token.expiry_date
              ? { number: token.expiry_date }
              : { number: null },
            updated_at: { date: { start: now } },
          },
        });
      } else {
        // ✅ Create new record
        console.log(`🆕 Creating new token record for user_id=${token.user_id}`);
        await notion.pages.create({
          parent: { database_id: DATABASE_ID },
          properties: {
            user_id: { title: [{ text: { content: token.user_id } }] },
            email: { email: token.email || null },
            access_token: { rich_text: [{ text: { content: token.access_token } }] },
            refresh_token: token.refresh_token
              ? { rich_text: [{ text: { content: token.refresh_token } }] }
              : { rich_text: [] },
            scope: { rich_text: [{ text: { content: token.scope } }] },
            token_type: { rich_text: [{ text: { content: token.token_type } }] },
            expiry_date: token.expiry_date
              ? { number: token.expiry_date }
              : { number: null },
            created_at: { date: { start: now } },
            updated_at: { date: { start: now } },
          },
        });
      }
    } catch (error: any) {
      console.error("Error saving/updating Google token in Notion:", error.message);
      throw error;
    }
  }

  // Get Google Token
  static async getGoogleToken(user_id: string): Promise<GoogleToken | null> {
    try {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "user_id",
          title: {
            equals: user_id,
          },
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      const props: any = (page as any).properties;

      return {
        user_id: props.user_id?.title?.[0]?.plain_text || "",
        email: props.email?.email || "",
        access_token: props.access_token?.rich_text?.[0]?.plain_text || "",
        refresh_token: props.refresh_token?.rich_text?.[0]?.plain_text || "",
        scope: props.scope?.rich_text?.[0]?.plain_text || "",
        token_type: props.token_type?.rich_text?.[0]?.plain_text || "",
        expiry_date: props.expiry_date?.number || null,
        created_at: props.created_at?.date?.start || null,
        updated_at: props.updated_at?.date?.start || null,
      };
    } catch (error: any) {
      console.error("Error fetching Google token from Notion:", error.message);
      throw error;
    }
  }
}
