import { CallStatusType } from "data/fetchers";
import { z } from "zod";

export const CalendlyWebhookEventType = z.enum([
  "invitee.created",
  "invitee.canceled",
  "invitee_no_show.created",
  "invitee_no_show.deleted",
]);

export type CalendlyWebhookEventType = z.infer<typeof CalendlyWebhookEventType>;

// Tracking params from UTM parameters in Calendly embed URL
const TrackingSchema = z.object({
  utm_campaign: z.string().nullable().optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
  salesforce_uuid: z.string().nullable().optional(),
});

// Scheduled event - nested in payload
const ScheduledEventSchema = z.object({
  uri: z.string(),
  name: z.string(),
  status: z.enum(["active", "canceled"]),
  start_time: z.string(),
  end_time: z.string(),
});

// The payload IS the invitee data (not nested under payload.invitee)
const InviteePayloadSchema = z.object({
  uri: z.string(),
  email: z.email(),
  name: z.string(),
  status: z.enum(["active", "canceled"]),
  timezone: z.string(),
  tracking: TrackingSchema,
  scheduled_event: ScheduledEventSchema,
  no_show: z.any().nullable().optional(),
  rescheduled: z.boolean().optional(),
  new_invitee: z.string().nullable().optional(),
  old_invitee: z.string().nullable().optional(),
});

export const CalendlyWebhookSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("invitee.created"),
    created_at: z.string(),
    payload: InviteePayloadSchema,
  }),
  z.object({
    event: z.literal("invitee.canceled"),
    created_at: z.string(),
    payload: InviteePayloadSchema,
  }),
  z.object({
    event: z.literal("invitee_no_show.created"),
    created_at: z.string(),
    payload: InviteePayloadSchema,
  }),
  z.object({
    event: z.literal("invitee_no_show.deleted"),
    created_at: z.string(),
    payload: InviteePayloadSchema,
  }),
]);

export type CalendlyWebhook = z.infer<typeof CalendlyWebhookSchema>;

// Map webhook events to call status
export const eventToCallStatus: Record<CalendlyWebhookEventType, CallStatusType> = {
  "invitee.created": "scheduled",
  "invitee.canceled": "cancelled",
  "invitee_no_show.created": "no_show",
  "invitee_no_show.deleted": "no_show",
};

export function parseWebhook(data: unknown) {
  return CalendlyWebhookSchema.safeParse(data);
}

// Extract deal_id from tracking params (utm_content)
// In Calendly webhook, tracking is directly on payload (payload IS the invitee)
export function extractDealId(webhook: CalendlyWebhook): string | null {
  const tracking = webhook.payload.tracking;
  return tracking?.utm_content ?? null;
}
