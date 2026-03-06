"use server";

import { zodAddress } from "data/utils";
import { Address } from "viem";
import { z } from "zod";

import { supabase } from "./client";

const metadataSchema = z.object({
  /** required by 721 standard */
  name: z.string(),
  description: z.string(),
  image: z.string(),
  /** Attributes */
  manufacturer: z.string(),
  model: z.string(),
  quantity: z.number(),
  serverRack: z.string(),
  unitNumber: z.string(),
  serialNumber: z.string(),
  collateralValueUSD: z.number(),
  usefulLifeDays: z.number(),
});

const schema = z.object({
  id: z.string(),
  collection: zodAddress,
  metadata: metadataSchema,
});

export type NftMetadata = z.infer<typeof schema>;

type GetNftMetadataParams = {
  ids: string[];
  collection: Address;
};

export async function getNftMetadata(params: GetNftMetadataParams) {
  const { ids, collection } = params;

  const { data, error } = await supabase //
    .from("NFTMetadata")
    .select("*")
    .in("id", ids)
    .eq("collection", collection.toLowerCase());

  if (error) throw error;

  return z.array(schema).parse(data);
}
