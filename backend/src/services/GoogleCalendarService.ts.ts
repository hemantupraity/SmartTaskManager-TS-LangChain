// backend/src/services/GoogleCalendarService.ts
import { google, calendar_v3 } from "googleapis";
import { GoogleCalendarTool } from "../tools/GoogleCalendarTool";

export class GoogleCalendarService {
  /** List upcoming events */
  static async listEvents(
    maxResults = 10
  ): Promise<calendar_v3.Schema$Event[]> {
    const calendar = GoogleCalendarTool.getCalendar();

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items ?? [];
  }

  /** Create an event */
  static async createEvent(
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | null> {
    const calendar = GoogleCalendarTool.getCalendar();

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return res.data ?? null;
  }

  /** Update an event by ID */
  static async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | null> {
    const calendar = GoogleCalendarTool.getCalendar();

    const res = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: event,
    });

    return res.data ?? null;
  }

  /** Delete an event by ID */
  static async deleteEvent(eventId: string): Promise<void> {
    const calendar = GoogleCalendarTool.getCalendar();

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  }
}
