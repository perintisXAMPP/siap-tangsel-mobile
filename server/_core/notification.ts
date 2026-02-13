import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const buildEndpointUrl = (baseUrl: string): string => {
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl
    : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required.",
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required.",
    });
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`,
    });
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`,
    });
  }

  return { title, content };
};

/**
 * Dispatches a project-owner notification through the Manus Notification Service.
 * Returns `true` if the request was accepted, `false` when the upstream service
 * cannot be reached (callers can fall back to email/slack). Validation errors
 * bubble up as TRPC errors so callers can fix the payload.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured.",
    });
  }

  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured.",
    });
  }

  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

/**
 * Send email notification to specific user
 */
export async function sendEmailNotification(
  email: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  try {
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.warn("[Email] Missing API credentials");
      return false;
    }

    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      console.error("[Email] API error:", response.status, await response.text());
      return false;
    }

    console.log("[Email] Sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

/**
 * Generate HTML email template untuk agenda baru
 */
export function generateAgendaEmailTemplate(
  agendaTitle: string,
  eventDate: string,
  eventLocation: string,
  organizer: string,
  description: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #FF00FF; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; border: 2px solid #FF00FF; box-shadow: 0 0 10px rgba(255, 0, 255, 0.5); }
        .header { border-bottom: 2px solid #00FFFF; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #FF00FF; text-shadow: 0 0 10px rgba(255, 0, 255, 0.8); margin: 0; }
        .content { margin: 20px 0; }
        .field { margin: 15px 0; }
        .field-label { color: #00FFFF; font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .field-value { color: #FF00FF; margin-top: 5px; font-size: 14px; }
        .footer { border-top: 2px solid #00FFFF; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #00FFFF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AGENDA BARU - SIAP TANGSEL</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Judul Agenda</div>
            <div class="field-value">${agendaTitle}</div>
          </div>
          <div class="field">
            <div class="field-label">Tanggal & Waktu</div>
            <div class="field-value">${eventDate}</div>
          </div>
          <div class="field">
            <div class="field-label">Lokasi</div>
            <div class="field-value">${eventLocation}</div>
          </div>
          <div class="field">
            <div class="field-label">Penyelenggara</div>
            <div class="field-value">${organizer}</div>
          </div>
          <div class="field">
            <div class="field-label">Deskripsi</div>
            <div class="field-value">${description}</div>
          </div>
        </div>
        <div class="footer">
          <p>Sistem Informasi Agenda Protokoler Kota Tangerang Selatan</p>
          <p>Email ini dikirim secara otomatis. Jangan balas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template untuk disposition approval needed
 */
export function generateDispositionEmailTemplate(
  documentTitle: string,
  documentNumber: string,
  priority: string,
  dueDate: string,
  description: string
): string {
  const priorityColor = priority === "urgent" ? "#FF0000" : priority === "high" ? "#FFA500" : "#FFFF00";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #00FFFF; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; border: 2px solid #00FFFF; box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
        .header { border-bottom: 2px solid #FF00FF; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #00FFFF; text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); margin: 0; }
        .priority { display: inline-block; background-color: ${priorityColor}; color: #0a0a0a; padding: 5px 10px; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 10px; }
        .content { margin: 20px 0; }
        .field { margin: 15px 0; }
        .field-label { color: #FF00FF; font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .field-value { color: #00FFFF; margin-top: 5px; font-size: 14px; }
        .footer { border-top: 2px solid #FF00FF; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #FF00FF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DISPOSISI MEMERLUKAN APPROVAL</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Judul Dokumen</div>
            <div class="field-value">${documentTitle}</div>
          </div>
          <div class="field">
            <div class="field-label">Nomor Dokumen</div>
            <div class="field-value">${documentNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Prioritas</div>
            <div class="priority">${priority.toUpperCase()}</div>
          </div>
          <div class="field">
            <div class="field-label">Deadline</div>
            <div class="field-value">${dueDate}</div>
          </div>
          <div class="field">
            <div class="field-label">Deskripsi</div>
            <div class="field-value">${description}</div>
          </div>
        </div>
        <div class="footer">
          <p>Sistem Informasi Agenda Protokoler Kota Tangerang Selatan</p>
          <p>Email ini dikirim secara otomatis. Jangan balas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
