"use server";

import { pipedriveClient } from "data/clients";
import { CUSTOM_FIELD_KEYS, STAGES } from "data/clients/pipedrive/constants.generated";
import { z } from "zod";

import { getPersonName } from "./getPersonName";

const addressSchema = z.object({ value: z.string() });

const monetarySchema = z.object({ value: z.number().nullable(), currency: z.string() });

const customFieldsSchema = z.object({
  [CUSTOM_FIELD_KEYS.LOAN_AMOUNT]: monetarySchema.nullable().optional(),
  // Loan Terms
  [CUSTOM_FIELD_KEYS.DURATION_MO]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.APR]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.LTV]: z.number().nullable().optional(),
  // Hardware
  [CUSTOM_FIELD_KEYS.SERVER_OEM]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.COLLATERAL_VALUE]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.CHIP_SERVER_TYPE]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.COUNT_SERVER]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.GPUS_PER_SERVER]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.ANCILLARY_COST]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.UNIT_PRICE]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.GPU_AGE]: z.string().nullable().optional(),
  // Datacenter
  [CUSTOM_FIELD_KEYS.DATA_CENTER_OPERATOR]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.DATA_CENTER_COUNTRY]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.DATA_CENTER_ADDRESS]: addressSchema.nullable().optional(),
  [CUSTOM_FIELD_KEYS.DATA_CENTER_TIER]: z.string().nullable().optional(),
  // Offtake
  [CUSTOM_FIELD_KEYS.OFFTAKER]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.NAME_OF_OFFTAKER]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.LENGTH_OF_CONTRACT_MONTHS]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.CONTRACT_RATE_HR_GPU]: monetarySchema.nullable().optional(),
  [CUSTOM_FIELD_KEYS.UP_FRONT_DEPOSIT]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.UP_FRONT_DEPOSIT_78]: z.string().nullable().optional(),
  // Borrower Intake
  [CUSTOM_FIELD_KEYS.NDA_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.NDA_OVERRIDE]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.TERMSHEET_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.TERMSHEET_OVERRIDE]: z.string().nullable().optional(),
  // Diligence Items
  [CUSTOM_FIELD_KEYS.KYB_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.KYB_OVERRIDE]: z.url().nullable().optional(),
  [CUSTOM_FIELD_KEYS.DATACENTERONEPAGER_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.PURCHASEORDER_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.OEM_PAYMENT_TERMS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.ONRAMP_OFFRAMP]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.COLOCATIONAGREEMENT_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.OFFTAKE_AGREEMENT]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.BRIDGE_LOAN]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.JURISDICTION_REVIEW]: z.number().nullable().optional(),
  // SPV Formation
  [CUSTOM_FIELD_KEYS.SPV_ONE_STOP]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.SPV_LLC_NAME]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.SPVONESTOP_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.SPVONESTOP_OVERRIDE]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_OVERRIDE]: z.string().nullable().optional(),
  // Purchase Order
  [CUSTOM_FIELD_KEYS.PROOF_OF_ORDER]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.SPV_IS_PO_PURCHASER]: z.number().nullable().optional(),
  // Equipment Delivery & Install
  [CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_OVERRIDE]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_STATUS]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_OVERRIDE]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.ARAVOLTA]: z.number().nullable().optional(),
  [CUSTOM_FIELD_KEYS.ASSETS_ADDED_TO_MASTER_INSURANCE]: z.number().nullable().optional(),
  // Funding
  [CUSTOM_FIELD_KEYS.ASSETS_TOKENIZED_AND_SENT]: z.string().nullable().optional(),
  [CUSTOM_FIELD_KEYS.LOAN_EXECUTED]: z.string().nullable().optional(),
});

const dealSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    status: z.string(),
    stage_id: z.number(),
    person_id: z.number().nullable(),
    org_id: z.number().nullable(),
    add_time: z.string(),
    custom_fields: customFieldsSchema,
  })
  .transform((deal) => ({
    id: deal.id,
    title: deal.title,
    status: deal.status,
    stage_id: deal.stage_id as STAGES,
    person_id: deal.person_id,
    org_id: deal.org_id,
    add_time: deal.add_time,
    loanAmount: deal.custom_fields[CUSTOM_FIELD_KEYS.LOAN_AMOUNT],
    custom_fields: {
      // Loan Terms
      durationMonths: deal.custom_fields[CUSTOM_FIELD_KEYS.DURATION_MO],
      ltv: deal.custom_fields[CUSTOM_FIELD_KEYS.LTV],
      apr: deal.custom_fields[CUSTOM_FIELD_KEYS.APR],
      // Hardware
      oem: deal.custom_fields[CUSTOM_FIELD_KEYS.SERVER_OEM],
      collateralValue: deal.custom_fields[CUSTOM_FIELD_KEYS.COLLATERAL_VALUE],
      gpuType: deal.custom_fields[CUSTOM_FIELD_KEYS.CHIP_SERVER_TYPE],
      nbServers: deal.custom_fields[CUSTOM_FIELD_KEYS.COUNT_SERVER],
      gpusPerServer: deal.custom_fields[CUSTOM_FIELD_KEYS.GPUS_PER_SERVER],
      ancillaryCost: deal.custom_fields[CUSTOM_FIELD_KEYS.ANCILLARY_COST],
      unitPrice: deal.custom_fields[CUSTOM_FIELD_KEYS.UNIT_PRICE],
      ageOfGpus: deal.custom_fields[CUSTOM_FIELD_KEYS.GPU_AGE],
      // Datacenter
      dataCenterOperator: deal.custom_fields[CUSTOM_FIELD_KEYS.DATA_CENTER_OPERATOR],
      location: deal.custom_fields[CUSTOM_FIELD_KEYS.DATA_CENTER_COUNTRY],
      dataCenterAddress: deal.custom_fields[CUSTOM_FIELD_KEYS.DATA_CENTER_ADDRESS],
      dataCenterTier: deal.custom_fields[CUSTOM_FIELD_KEYS.DATA_CENTER_TIER],
      // Offtake
      offtaker: deal.custom_fields[CUSTOM_FIELD_KEYS.OFFTAKER],
      offtakerName: deal.custom_fields[CUSTOM_FIELD_KEYS.NAME_OF_OFFTAKER],
      lengthOfContract: deal.custom_fields[CUSTOM_FIELD_KEYS.LENGTH_OF_CONTRACT_MONTHS],
      perGpuRate: deal.custom_fields[CUSTOM_FIELD_KEYS.CONTRACT_RATE_HR_GPU],
      upfrontDeposit: deal.custom_fields[CUSTOM_FIELD_KEYS.UP_FRONT_DEPOSIT],
      upfrontDepositPercent: deal.custom_fields[CUSTOM_FIELD_KEYS.UP_FRONT_DEPOSIT_78],
      // Borrower Intake
      ndaStatus: deal.custom_fields[CUSTOM_FIELD_KEYS.NDA_STATUS],
      ndaOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.NDA_OVERRIDE],
      termSheetStatus: deal.custom_fields[CUSTOM_FIELD_KEYS.TERMSHEET_STATUS],
      termSheetOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.TERMSHEET_OVERRIDE],
      // Diligence Items
      kybStatus: deal.custom_fields[CUSTOM_FIELD_KEYS.KYB_STATUS],
      kybOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.KYB_OVERRIDE],
      onePager: deal.custom_fields[CUSTOM_FIELD_KEYS.DATACENTERONEPAGER_STATUS],
      purchaseOrder: deal.custom_fields[CUSTOM_FIELD_KEYS.PURCHASEORDER_STATUS],
      net30: deal.custom_fields[CUSTOM_FIELD_KEYS.OEM_PAYMENT_TERMS],
      onrampOfframp: deal.custom_fields[CUSTOM_FIELD_KEYS.ONRAMP_OFFRAMP],
      colocationAgreement: deal.custom_fields[CUSTOM_FIELD_KEYS.COLOCATIONAGREEMENT_STATUS],
      offtakeAgreement: deal.custom_fields[CUSTOM_FIELD_KEYS.OFFTAKE_AGREEMENT],
      bridgeLoan: deal.custom_fields[CUSTOM_FIELD_KEYS.BRIDGE_LOAN],
      jurisdictionReview: deal.custom_fields[CUSTOM_FIELD_KEYS.JURISDICTION_REVIEW],
      // SPV Formation
      spvOneStop: deal.custom_fields[CUSTOM_FIELD_KEYS.SPV_ONE_STOP],
      spvLlcName: deal.custom_fields[CUSTOM_FIELD_KEYS.SPV_LLC_NAME],
      spvOneStopStatus: deal.custom_fields[CUSTOM_FIELD_KEYS.SPVONESTOP_STATUS],
      spvOneStopOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.SPVONESTOP_OVERRIDE],
      customerServiceAgreement: deal.custom_fields[CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_STATUS],
      customerServiceAgreementOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_OVERRIDE],
      // Purchase Order
      proofOfOrder: deal.custom_fields[CUSTOM_FIELD_KEYS.PROOF_OF_ORDER],
      spvIsPoPurchaser: deal.custom_fields[CUSTOM_FIELD_KEYS.SPV_IS_PO_PURCHASER],
      // Equipment Delivery & Install
      saleAndContributionAgreement: deal.custom_fields[CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_STATUS],
      saleAndContributionAgreementOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_OVERRIDE],
      warehouseReceipt: deal.custom_fields[CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_STATUS],
      warehouseReceiptOverride: deal.custom_fields[CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_OVERRIDE],
      aravolta: deal.custom_fields[CUSTOM_FIELD_KEYS.ARAVOLTA],
      masterInsurancePolicy: deal.custom_fields[CUSTOM_FIELD_KEYS.ASSETS_ADDED_TO_MASTER_INSURANCE],
      // Funding
      assetsTokenizedAndSent: deal.custom_fields[CUSTOM_FIELD_KEYS.ASSETS_TOKENIZED_AND_SENT],
      loanExecuted: deal.custom_fields[CUSTOM_FIELD_KEYS.LOAN_EXECUTED],
    },
  }));

type DealDetailWithoutPersonName = z.infer<typeof dealSchema>;

export type DealDetail = DealDetailWithoutPersonName & {
  firstName: string;
  lastName: string;
};

export async function getDealDetail(dealId: number): Promise<DealDetail> {
  const response = await pipedriveClient.GET("/deals", {
    params: { query: { ids: dealId.toString() } },
  });

  const deals = z.array(dealSchema).parse(response.data?.data);
  const deal = deals[0];

  if (!deal || !deal.person_id) throw new Error("Deal not found");

  const personName = await getPersonName(deal.person_id);

  return {
    ...deal,
    firstName: personName.firstName,
    lastName: personName.lastName,
  };
}
