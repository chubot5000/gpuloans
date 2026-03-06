"use server";

import { zodAddress, zodStringToBigInt } from "data/utils";
import { Address } from "viem";
import { z } from "zod";

import { supabase } from "./client";

const trancheSpecSchema = z.object({
  id: z.string(),
  lender: zodAddress,
  amount: zodStringToBigInt,
  rate: zodStringToBigInt,
});

const loanTermsSchema = z
  .object({
    id: z.string(),
    chain: z.number(),
    borrower: zodAddress,
    expiration: z.number(),
    numberOfPayments: z.number(),
    repaymentInterval: z.number(),
    interestRateModel: zodAddress,
    gracePeriodDuration: z.number(),
    gracePeriodRate: zodStringToBigInt,
    exitFee: zodStringToBigInt,
    originationFee: zodStringToBigInt,
    TrancheSpecs: z.array(trancheSpecSchema),
    erc721: zodAddress,
    startTokenId: zodStringToBigInt.nullable(),
    endTokenId: zodStringToBigInt.nullable(),
    erc20: zodAddress,
    metadata: z
      .record(z.string(), z.any())
      .nullable()
      .transform((v) => {
        const nullableNumber = z.number().nullish();
        return {
          name: z.string().nullish().parse(v?.["name"]),
          forceBundle: z.boolean().optional().default(false).parse(v?.["forceBundle"]),
          debtReserveAccount: nullableNumber.parse(v?.["debtReserveAccount"]),
          capitalizeInsurance: nullableNumber.parse(v?.["capitalizeInsurance"]),
        };
      }),
  })
  .transform(({ TrancheSpecs, ...rest }) => {
    return {
      ...rest,
      duration: rest.numberOfPayments * rest.repaymentInterval,
      trancheSpecs: TrancheSpecs,
    };
  });

type RawLoanTerms = z.infer<typeof loanTermsSchema>;

export type LoanTerms = RawLoanTerms & {
  startTokenId: bigint;
  endTokenId: bigint;
};

export async function getLoanTermsByBorrower(borrower: Address) {
  const { data, error } = await supabase
    .from("LoanTerms")
    .select("*, TrancheSpecs(id, lender, amount, rate, sortKey)")
    .eq("borrower", borrower.toLowerCase())
    .order("sortKey", { referencedTable: "TrancheSpecs", ascending: true });

  if (error) throw error;

  return z
    .array(loanTermsSchema)
    .parse(data)
    .filter((l): l is LoanTerms => l.startTokenId != null && l.endTokenId != null);
}
