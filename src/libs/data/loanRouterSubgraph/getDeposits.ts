"use server";

import { zodAddress, zodHash, zodStringToNumber } from "data/utils";
import { gql } from "graphql-request";
import { Hash } from "viem";
import z from "zod";

import { zodStringToBigInt } from "..";

import { getLoanRouterSubgraphClient } from "./client";

const query = gql`
  query Deposits($contexts: [Bytes!]!) {
    deposits(where: { context_in: $contexts }) {
      depositor
      amount
      expiration
      context
    }
  }
`;

const schema = z.object({
  depositor: zodAddress,
  amount: zodStringToBigInt,
  expiration: zodStringToNumber,
  context: zodHash,
});

type Params = {
  chainId: number;
  contexts: Hash[];
};

export async function getDeposits(Params: Params) {
  const { chainId, contexts } = Params;
  const data = await getLoanRouterSubgraphClient(chainId).request(query, { contexts });
  return z.array(schema).parse(data.deposits);
}
