import { CUSTOM_FIELD_KEYS, OFFTAKER } from "data/clients/pipedrive/constants.generated";
import type { DealDetail } from "data/fetchers";
import z from "zod";

// ============================================
// Reusable Validators
// ============================================

const requiredString = (message = "Required") =>
  z
    .string()
    .optional()
    .refine((val) => val && val.trim() !== "", { message });

const positiveNumber = (message = "Must be positive") => z.number().positive(message).optional();

const nonNegativeNumber = (message = "Must be 0 or greater") => z.number().min(0, message).optional();

// ============================================
// Section Schemas
// ============================================

const hardwareShape = {
  serverOem: requiredString(),
  gpuType: requiredString(),
  nbServers: positiveNumber(),
  gpusPerServer: positiveNumber(),
  ancillaryCost: nonNegativeNumber(),
  unitPrice: nonNegativeNumber(),
  gpuAge: requiredString(),
};

const dataCenterShape = {
  dataCenterOperator: requiredString(),
  dataCenterCountry: requiredString(),
  dataCenterState: z.string().optional(),
  dataCenterAddress: requiredString(),
  dataCenterTier: requiredString(),
};

const dataCenterRefinement = (data: { dataCenterCountry?: string; dataCenterState?: string }) => {
  if (data.dataCenterCountry === "United States") {
    return data.dataCenterState && data.dataCenterState.trim() !== "";
  }
  return true;
};

const offtakerShape = {
  offtakerType: z.number().optional(),
  offtakerName: z.string().optional(),
  lengthOfContract: z.string().optional(),
  contractRate: z.number().positive("Must be positive").optional(),
  hasUpfrontDeposit: z.enum(["yes", "no"]).optional(),
  upfrontDepositPercent: z.number().positive("Must be positive").optional(),
};

type OfftakerData = {
  offtakerType?: number;
  offtakerName?: string;
  lengthOfContract?: string;
  contractRate?: number;
  hasUpfrontDeposit?: "yes" | "no";
  upfrontDepositPercent?: number;
};

const hasOfftaker = (offtakerType: number | undefined) =>
  offtakerType !== undefined && offtakerType !== OFFTAKER["No offtake"];

const offtakerRefinement = (data: OfftakerData, ctx: z.RefinementCtx) => {
  if (!hasOfftaker(data.offtakerType)) return;

  const requiredFields = [
    { key: "offtakerName", value: data.offtakerName },
    { key: "lengthOfContract", value: data.lengthOfContract },
    { key: "contractRate", value: data.contractRate },
    { key: "hasUpfrontDeposit", value: data.hasUpfrontDeposit },
  ] as const;

  for (const { key, value } of requiredFields) {
    const isEmpty = value === undefined || value === null || (typeof value === "string" && value.trim() === "");

    if (isEmpty) {
      ctx.addIssue({ code: "custom", message: "Required", path: [key] });
    }
  }

  // Nested conditional: upfrontDepositPercent required when hasUpfrontDeposit is "yes"
  if (data.hasUpfrontDeposit === "yes" && !data.upfrontDepositPercent) {
    ctx.addIssue({
      code: "custom",
      message: "Required",
      path: ["upfrontDepositPercent"],
    });
  }
};

// ============================================
// Combined Schema
// ============================================

export const userApplicationSchema = z
  .object({
    ...hardwareShape,
    ...dataCenterShape,
    ...offtakerShape,
  })
  .superRefine((data, ctx) => {
    // Data center refinement
    if (!dataCenterRefinement(data)) {
      ctx.addIssue({ code: "custom", message: "Required", path: ["dataCenterState"] });
    }

    // Offtaker refinement
    offtakerRefinement(data, ctx);
  });

export type UserApplicationFormValues = z.infer<typeof userApplicationSchema>;

// ============================================
// Default Values
// ============================================

export const defaultFormValues: UserApplicationFormValues = {
  // Hardware
  serverOem: undefined,
  gpuType: undefined,
  nbServers: undefined,
  gpusPerServer: undefined,
  ancillaryCost: undefined,
  unitPrice: undefined,
  gpuAge: undefined,
  // Data Center
  dataCenterOperator: undefined,
  dataCenterCountry: undefined,
  dataCenterState: undefined,
  dataCenterAddress: undefined,
  dataCenterTier: undefined,
  // Offtaker
  offtakerType: undefined,
  offtakerName: undefined,
  lengthOfContract: undefined,
  contractRate: undefined,
  hasUpfrontDeposit: undefined,
  upfrontDepositPercent: undefined,
};

// ============================================
// Pipedrive Transformers
// ============================================

export function toPipedrivePayload(values: UserApplicationFormValues) {
  const customFields: Record<string, unknown> = {};
  const keys = CUSTOM_FIELD_KEYS;

  // Offtaker
  if (values.offtakerType !== undefined) {
    customFields[keys.OFFTAKER] = values.offtakerType;

    if (hasOfftaker(values.offtakerType)) {
      customFields[keys.NAME_OF_OFFTAKER] = values.offtakerName ?? null;
      customFields[keys.LENGTH_OF_CONTRACT_MONTHS] = values.lengthOfContract ?? null;
      customFields[keys.CONTRACT_RATE_HR_GPU] = values.contractRate
        ? { value: values.contractRate, currency: "USD" }
        : null;
      customFields[keys.UP_FRONT_DEPOSIT_78] =
        values.hasUpfrontDeposit === "yes" && values.upfrontDepositPercent != null
          ? String(values.upfrontDepositPercent)
          : null;
    } else {
      // "No offtake" - clear related fields
      customFields[keys.NAME_OF_OFFTAKER] = null;
      customFields[keys.LENGTH_OF_CONTRACT_MONTHS] = null;
      customFields[keys.CONTRACT_RATE_HR_GPU] = null;
      customFields[keys.UP_FRONT_DEPOSIT_78] = null;
    }
  }

  // Data Center
  customFields[keys.DATA_CENTER_OPERATOR] = values.dataCenterOperator ?? null;
  customFields[keys.DATA_CENTER_TIER] = values.dataCenterTier ?? null;
  customFields[keys.DATA_CENTER_ADDRESS] = values.dataCenterAddress ? { value: values.dataCenterAddress } : null;

  if (values.dataCenterCountry) {
    const location =
      values.dataCenterCountry === "United States" && values.dataCenterState
        ? `${values.dataCenterState}, ${values.dataCenterCountry}`
        : values.dataCenterCountry;
    customFields[keys.DATA_CENTER_COUNTRY] = location;
  }

  // Hardware
  customFields[keys.SERVER_OEM] = values.serverOem ?? null;
  customFields[keys.CHIP_SERVER_TYPE] = values.gpuType ?? null;
  customFields[keys.COUNT_SERVER] = values.nbServers ?? null;
  customFields[keys.GPUS_PER_SERVER] = values.gpusPerServer ?? null;
  customFields[keys.ANCILLARY_COST] = values.ancillaryCost ?? null;
  customFields[keys.UNIT_PRICE] = values.unitPrice ?? null;
  customFields[keys.GPU_AGE] = values.gpuAge ?? null;

  return { custom_fields: customFields };
}

export function fromDealDetail(dealDetail: DealDetail | null | undefined): Partial<UserApplicationFormValues> {
  if (!dealDetail) return {};

  const fields = dealDetail.custom_fields;
  const location = fields.location;

  return {
    // Hardware
    serverOem: fields.oem ?? undefined,
    gpuType: fields.gpuType ?? undefined,
    nbServers: fields.nbServers ?? undefined,
    gpusPerServer: fields.gpusPerServer ? Number(fields.gpusPerServer) : undefined,
    ancillaryCost: fields.ancillaryCost ?? undefined,
    unitPrice: fields.unitPrice ?? undefined,
    gpuAge: fields.ageOfGpus ?? undefined,
    // Data Center
    dataCenterOperator: fields.dataCenterOperator ?? undefined,
    dataCenterCountry: parseCountry(location),
    dataCenterState: parseState(location),
    dataCenterAddress: fields.dataCenterAddress?.value ?? undefined,
    dataCenterTier: fields.dataCenterTier ?? undefined,
    // Offtaker
    offtakerType: fields.offtaker ?? undefined,
    offtakerName: fields.offtakerName ?? undefined,
    lengthOfContract: fields.lengthOfContract ?? undefined,
    contractRate: fields.perGpuRate?.value ?? undefined,
    hasUpfrontDeposit: fields.upfrontDepositPercent ? "yes" : undefined,
    upfrontDepositPercent: fields.upfrontDepositPercent ? Number(fields.upfrontDepositPercent) : undefined,
  };
}

// Helper functions
function parseCountry(location: string | null | undefined): string | undefined {
  if (!location) return undefined;
  return location.endsWith(", United States") ? "United States" : location;
}

function parseState(location: string | null | undefined): string | undefined {
  if (!location?.endsWith(", United States")) return undefined;
  return location.replace(", United States", "");
}
