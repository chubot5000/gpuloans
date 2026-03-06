"use server";

import { pipedriveClient } from "data/clients";
import { STAGES } from "data/clients/pipedrive/constants.generated";
import { createApplication } from "data/fetchers/backend";
import { z } from "zod";

import { createPipedriveDeal } from "./createDeal";
import { createPipedriveOrganization } from "./createOrganization";
import { createPipedrivePerson } from "./createPerson";

const createQuoteSchema = z.object({
  fullName: z.string().min(1),
  workEmail: z.email(),
  companyName: z.string().min(1),
});

export type CreateQuoteRequestParams = z.infer<typeof createQuoteSchema>;

export type CreateQuoteRequestResult = {
  organizationId: number;
  personId: number;
  dealId: number;
};

async function rollback(
  organizationId: number | undefined,
  personId: number | undefined,
  dealId: number | undefined,
  organizationCreated: boolean,
  personCreated: boolean,
): Promise<void> {
  const deletions: Promise<unknown>[] = [];

  if (dealId)
    deletions.push(pipedriveClient.DELETE("/deals/{id}", { params: { path: { id: dealId } } }).catch(() => {}));

  if (personId && personCreated)
    deletions.push(pipedriveClient.DELETE("/persons/{id}", { params: { path: { id: personId } } }).catch(() => {}));

  if (organizationId && organizationCreated)
    deletions.push(
      pipedriveClient.DELETE("/organizations/{id}", { params: { path: { id: organizationId } } }).catch(() => {}),
    );

  await Promise.all(deletions);
}

/**
 * Creates a quote request in Pipedrive (organization, person, and deal)
 * @param params - The quote request parameters
 * @param params.fullName - Full name of the contact person
 * @param params.workEmail - Work email of the contact person
 * @param params.companyName - Name of the company/organization
 * @returns The IDs of the created organization, person, and deal
 * @throws {PipedriveError} If any creation step fails (with automatic rollback of created entities)
 */
export async function createQuoteRequest(params: CreateQuoteRequestParams): Promise<CreateQuoteRequestResult> {
  const { fullName, workEmail, companyName } = createQuoteSchema.parse(params);

  let organizationId: number | undefined;
  let personId: number | undefined;
  let dealId: number | undefined;
  let organizationCreated = false;
  let personCreated = false;

  try {
    const organizationResult = await createPipedriveOrganization({ name: companyName });
    organizationId = organizationResult.data.id;
    organizationCreated = organizationResult.created;

    const personResult = await createPipedrivePerson({
      name: fullName,
      org_id: organizationId,
      emails: [{ value: workEmail, primary: true }],
    });
    personId = personResult.data.id;
    personCreated = personResult.created;

    const deal = await createPipedriveDeal({
      title: companyName,
      person_id: personId,
      org_id: organizationId,
      stage_id: STAGES.NEW_LEAD,
    });
    dealId = deal.id;

    await createApplication(dealId);

    return {
      organizationId,
      personId,
      dealId,
    };
  } catch (error) {
    await rollback(organizationId, personId, dealId, organizationCreated, personCreated);
    throw error;
  }
}
