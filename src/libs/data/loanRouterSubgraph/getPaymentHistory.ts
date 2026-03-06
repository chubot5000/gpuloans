"use server";

import { zodStringToBigInt, zodStringToNumber } from "data/utils";
import { gql } from "graphql-request";
import { compact } from "lodash";
import { Hash } from "viem";
import z from "zod";

import { getLoanRouterSubgraphClient } from "./client";

const schema = z.object({
  loanRouterEvents: z.array(
    z.object({
      timestamp: zodStringToNumber,
      loanRepaid: z
        .object({
          principal: zodStringToBigInt,
          interest: zodStringToBigInt,
          prepayment: zodStringToBigInt,
          exitFee: zodStringToBigInt,
          isRepaid: z.boolean(),
        })
        .nullable(),
    }),
  ),
});

const query = gql`
  query LoanEvents($loanTermsHash: Bytes!) {
    loanRouterEvents(where: { loanTermsHash: $loanTermsHash }, orderBy: timestamp, orderDirection: asc, first: 1000) {
      timestamp
      loanRepaid {
        principal
        interest
        prepayment
        exitFee
        isRepaid
      }
    }
  }
`;

export type PaymentHistoryEntry = Awaited<ReturnType<typeof getPaymentHistory>>[number];

type Params = {
  chainId: number;
  loanTermsHash: Hash;
  repaymentInterval: number;
};

export async function getPaymentHistory(params: Params) {
  const { chainId, loanTermsHash, repaymentInterval } = params;

  const client = getLoanRouterSubgraphClient(chainId);
  const data = await client.request(query, { loanTermsHash });

  const { loanRouterEvents } = schema.parse(data);

  return compact(
    loanRouterEvents.map((e, idx) => {
      /* skip any non-repayment events */
      if (!e.loanRepaid) return null;

      /* first event is origination, so can safely use idx - 1 */
      const repaymentDeadline = loanRouterEvents[idx - 1].timestamp + repaymentInterval;

      return { timestamp: e.timestamp, ...e.loanRepaid, isGracePeriod: e.timestamp > repaymentDeadline };
    }),
  ).reverse();
}
