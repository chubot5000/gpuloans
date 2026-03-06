"use server";

import { pipedriveClient } from "data/clients";
import { z } from "zod";

const personSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
});

export type PersonName = {
  firstName: string;
  lastName: string;
  fullName: string;
};

export async function getPersonName(personId: number): Promise<PersonName> {
  const response = await pipedriveClient.GET("/persons/{id}", {
    params: {
      path: { id: personId },
    },
  });

  const person = personSchema.safeParse(response.data?.data);

  if (!person.success) throw new Error("Failed to get person name");

  return {
    firstName: person.data.first_name,
    lastName: person.data.last_name,
    fullName: `${person.data.first_name} ${person.data.last_name}`,
  };
}
