"use server";

import { pipedriveClientV1, PipedriveError } from "data/clients";
import { z } from "zod";

import { createPipedrivePerson } from "../createPerson";

import type { Participant } from "./getParticipants";

export type AddParticipant = Pick<Participant, "name"> & { email: string; existingPersonId?: number };

const responseSchema = z.object({
  data: z.object({ id: z.number() }),
});

export async function addParticipant(dealId: number, participant: AddParticipant, orgId?: number | null) {
  let personId: number;

  if (participant.existingPersonId) {
    personId = participant.existingPersonId;
  } else {
    const personResult = await createPipedrivePerson({
      name: participant.name,
      emails: [{ value: participant.email, primary: true, label: "work" }],
      org_id: orgId ?? undefined,
    });
    personId = personResult.data.id;
  }

  const response = await pipedriveClientV1.POST("/deals/{id}/participants", {
    params: { path: { id: dealId } },
    body: { person_id: personId },
  });

  const parsed = responseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new PipedriveError(
      "ADD_PARTICIPANT_FAILED",
      response.response?.status || 500,
      "Failed to add participant: Invalid response",
    );
  }

  return;
}
