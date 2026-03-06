"use server";

import { pipedriveClientV1, PipedriveError } from "data/clients";

export async function removeParticipant(dealId: number, participantId: number): Promise<void> {
  const response = await pipedriveClientV1.DELETE("/deals/{id}/participants/{deal_participant_id}", {
    params: { path: { id: dealId, deal_participant_id: participantId } },
  });

  if (!response.response.ok) {
    throw new PipedriveError("REMOVE_PARTICIPANT_FAILED", response.response.status, "Failed to remove participant");
  }
}
