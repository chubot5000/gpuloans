import { stringToJSONSchema, zodAddress } from "data/utils";
import { Address } from "viem";
import { z } from "zod";

export const privyUserMetadataSchema = z
  .object({
    linkedWallets: stringToJSONSchema
      .pipe(
        z.array(
          z.object({
            recipients: z.array(zodAddress).default([]),
            id: z.string(),
            address: zodAddress.transform((a) => a.toLowerCase() as Address),
            kQId: z.string(),
          }),
        ),
      )
      .default([]),
  })
  .default({ linkedWallets: [] });

export type PrivyUserMetadata = z.infer<typeof privyUserMetadataSchema>;
export type PrivyLinkedWallet = PrivyUserMetadata["linkedWallets"][number];
