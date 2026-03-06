import z from "zod";

export const CallStatus = z.enum(["scheduled", "cancelled", "rescheduling", "no_show", "completed"]);

export type CallStatusType = z.infer<typeof CallStatus>;

export const DealCallSchema = z.object({
  deal_id: z.string(),
  id: z.number(),
  metadata: z
    .object({
      call_status: CallStatus,
      invitee_email: z.string().optional(),
      invitee_name: z.string().optional(),
      scheduled_start: z.string().optional(),
      scheduled_end: z.string().optional(),
      event_name: z.string().optional(),
      last_webhook_event: z.string().optional(),
      last_webhook_at: z.string().optional(),
    })
    .nullable(),
});

export async function getDealCallStatus(dealId: string | number) {
  try {
    const response = await fetch(`/api/calendly/${dealId}`, {
      next: { revalidate: 1 },
    });

    if (!response.ok) console.error(`Failed to fetch deal call status: ${response.statusText}`);

    const data = await response.json();
    const parsed = DealCallSchema.safeParse(data);

    if (!parsed.success) return null;

    return parsed.data;
  } catch {
    return null;
  }
}
