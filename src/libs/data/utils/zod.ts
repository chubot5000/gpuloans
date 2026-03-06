import { isAddress, isHash, isHex } from "viem";
import { json, z } from "zod";

export const zodAddress = z.string().transform((a) => {
  if (!isAddress(a)) throw new Error("Invalid address");
  return a;
});
export const zodHex = z.string().transform((a) => {
  if (!isHex(a)) throw new Error("Invalid hex");
  return a;
});
export const zodHash = z.string().transform((a) => {
  if (!isHash(a)) throw new Error("Invalid hash");
  return a;
});

export const zodStringToBigInt = z.string().transform(BigInt);
export const zodStringToNumber = z.string().transform((value) => Number.parseFloat(value));
export const zodNumberToBigInt = z.number().transform(BigInt);

// Validate that the string is in YYYY-MM-DD format
export const dateString = z.string().refine((val) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
  const date = new Date(val);
  return date instanceof Date && !isNaN(date.getTime());
}, "Invalid date string format. Expected YYYY-MM-DD");

export const stringToJSONSchema = z.string().transform((str, ctx): z.infer<ReturnType<typeof json>> => {
  try {
    return JSON.parse(str);
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid JSON" });
    return z.NEVER;
  }
});
