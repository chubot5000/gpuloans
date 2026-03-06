export const dynamic = "force-dynamic";

import { CallStatusType } from "data/fetchers";
import { supabase } from "data/supabase";
import { Database, Json } from "data/supabase/database.types";
import { NextRequest, NextResponse } from "next/server";

import { parseWebhook, extractDealId, eventToCallStatus } from "../schema";

type DealMetadataRow = Database["usdai_loans"]["Tables"]["CalendlyMetadata"]["Row"];

interface DealMetadata {
  call_status: CallStatusType;
  invitee_email?: string;
  invitee_name?: string;
  invitee_uri?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  event_name?: string;
  last_webhook_event?: string;
  last_webhook_at?: string;
  rescheduling_at?: string;
}

async function findDealForReschedule(email: string, oldInviteeUri?: string | null): Promise<string | null> {
  // Strategy 1: Match by old_invitee URI (Calendly sends this on reschedule)
  if (oldInviteeUri) {
    const { data: matchByUri } = await supabase
      .from("CalendlyMetadata")
      .select("deal_id")
      .filter("metadata->>invitee_uri", "eq", oldInviteeUri)
      .single();

    if (matchByUri) {
      return matchByUri.deal_id;
    }
  }

  // Strategy 2: Find by email + rescheduling status + recent timestamp (within 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { data: matchByEmailAndStatus } = await supabase
    .from("CalendlyMetadata")
    .select("deal_id, metadata")
    .filter("metadata->>invitee_email", "eq", email)
    .filter("metadata->>call_status", "eq", "rescheduling")
    .filter("metadata->>rescheduling_at", "gte", tenMinutesAgo)
    .order("metadata->>rescheduling_at", { ascending: false })
    .limit(1)
    .single();

  if (matchByEmailAndStatus) {
    return matchByEmailAndStatus.deal_id;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("Calendly-Webhook-Signature");
    const body = await request.json();

    console.log("Received Calendly webhook", { signature });

    const parseResult = parseWebhook(body);
    if (!parseResult.success) {
      console.error("Invalid webhook payload", {
        errors: parseResult.error.issues,
      });
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const webhook = parseResult.data;
    let dealId = extractDealId(webhook);

    const { uri: inviteeUri, email, name, scheduled_event, rescheduled, old_invitee } = webhook.payload;

    if (!dealId && webhook.event === "invitee.created") {
      dealId = await findDealForReschedule(email, old_invitee);

      if (dealId) {
        console.log("Matched rescheduled booking to existing deal", {
          dealId,
          email,
          old_invitee,
        });
      }
    }

    if (!dealId) {
      console.warn("No deal_id found in webhook tracking params", {
        event: webhook.event,
        invitee: email,
        tracking: webhook.payload.tracking,
        old_invitee,
      });
      return NextResponse.json({ success: false, reason: "no_deal_id" });
    }

    let callStatus = eventToCallStatus[webhook.event];

    if (webhook.event === "invitee.canceled" && rescheduled) {
      callStatus = "rescheduling";
      console.log("Call is being rescheduled, not cancelled", {
        dealId,
        email,
      });
    }

    const metadata: DealMetadata = {
      call_status: callStatus,
      invitee_email: email,
      invitee_name: name,
      invitee_uri: inviteeUri,
      scheduled_start: scheduled_event.start_time,
      scheduled_end: scheduled_event.end_time,
      event_name: scheduled_event.name,
      last_webhook_event: webhook.event,
      last_webhook_at: webhook.created_at,
      ...(callStatus === "rescheduling" && {
        rescheduling_at: new Date().toISOString(),
      }),
    };

    const { data: existing } = await supabase.from("CalendlyMetadata").select("*").eq("deal_id", dealId).single();

    let data: DealMetadataRow[] | null;
    let error: Error | null;

    if (existing) {
      const existingMetadata = existing.metadata as DealMetadata | null;

      // Block duplicate invitee.created only if there's already an active/scheduled call
      // Allow re-booking when: rescheduling, cancelled, no_show, or completed
      const allowRebookStatuses: CallStatusType[] = ["rescheduling", "cancelled", "no_show", "completed"];
      if (
        webhook.event === "invitee.created" &&
        existingMetadata?.call_status &&
        !allowRebookStatuses.includes(existingMetadata.call_status)
      ) {
        console.error("Duplicate call booking attempted for deal", {
          dealId,
          email,
          existingStatus: existingMetadata.call_status,
          existingEmail: existingMetadata.invitee_email,
          newScheduledStart: scheduled_event.start_time,
          existingScheduledStart: existingMetadata.scheduled_start,
        });
        return NextResponse.json({ success: false, reason: "duplicate_booking", dealId });
      }

      const result = await supabase
        .from("CalendlyMetadata")
        .update({ metadata: metadata as unknown as Json })
        .eq("deal_id", dealId)
        .select();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("CalendlyMetadata")
        .insert({
          deal_id: dealId,
          metadata: metadata as unknown as Json,
        })
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Failed to save deal", {
        error,
        dealId,
      });
      throw error;
    }

    console.log("Deal updated successfully", {
      dealId,
      callStatus,
      event: webhook.event,
    });

    return NextResponse.json({ success: true, dealId, callStatus, data });
  } catch (error) {
    console.error("Error handling Calendly webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to handle webhook" },
      { status: 500 },
    );
  }
}
