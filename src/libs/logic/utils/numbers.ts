import Big from "big.js";
import { formatUnits, parseUnits } from "viem";

export const ZERO = new Big(0);
export const ONE = new Big(1);
export const TWO = new Big(2);

/**************************************************************************/
/* From and To units
/**************************************************************************/
export const DEFAULT_DECIMALS = 18;

export type BigIntish = bigint | string | number | boolean;

export const BigIntAbs = (bigNumber: BigIntish) => {
  return BigInt(bigNumber) < 0 ? BigInt(bigNumber) * -1n : BigInt(bigNumber);
};

export const fromUnits = (bigNumber: BigIntish, decimals = DEFAULT_DECIMALS) => {
  return new Big(formatUnits(BigInt(bigNumber), decimals));
};

export const toUnits = (decimalNumber: number | string | Big, decimals = DEFAULT_DECIMALS) => {
  // if decimalNumber would have more fractional digits than `decimals`
  // we'd get an underflow error when calling `parseUnits`
  // so we call `.toFixed` to cap the digits and round it down
  const bigValue = new Big(decimalNumber).toFixed(decimals, Big.roundDown);

  return parseUnits(bigValue.toString(), decimals);
};

function scale(decimals: number) {
  return 10n ** BigInt(DEFAULT_DECIMALS - decimals);
}

export function scaleUp(n: bigint, decimals: number) {
  return n * scale(decimals);
}

export function scaleDown(n: bigint, decimals: number, rounding: "up" | "down" = "down") {
  const _n = rounding == "down" ? n : n + scale(decimals);

  return _n / scale(decimals);
}

// Big.js can parse numbers with an arbitrary number of fractional digits
// if we need the BigNumber from the input value, we can call `toBN(fromInput(input))`
// this parses the first 18 fractional digits (18th fractional digit is rounded down)
export const fromInput = (input: string) => {
  if (!input) return ZERO;
  if (input === ".") return ZERO;
  return new Big(input);
};

/**************************************************************************/
/* Pretty formatting
/**************************************************************************/

/*
 * for some reason Intl.NumberFormat is missing the roundingMode option
 */
export type NumberFormatOptions = Intl.NumberFormatOptions & {
  roundingMode?: "ceil" | "floor";
};

export const printNumber = (x: Big | number | string, options?: NumberFormatOptions) => {
  const SMALL_VALUE = 1;
  const BIG_VALUE = 9_999;
  try {
    const value = x instanceof Big ? x : new Big(x || "0");

    let maximumFractionDigits = 1;
    if (value.lt(SMALL_VALUE)) maximumFractionDigits = 3;
    else if (value.gt(BIG_VALUE)) maximumFractionDigits = 0;

    //   If using locale becomes a UX issue, default this to `en-US`
    const locale = "en-US";
    const _options: NumberFormatOptions = {
      maximumFractionDigits,
      ...options,
    };

    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#syntax
    return new Intl.NumberFormat(locale, _options).format(value.toNumber());
  } catch (error) {
    throw new Error(`Value: ${x} caused an error: ${error}`);
  }
};

export const printPercent = (x: Big | number | string, options?: NumberFormatOptions) => {
  return printNumber(x, {
    style: "percent",
    maximumFractionDigits: 0,
    roundingMode: "floor",
    ...options,
  });
};

export const printPercent1FD: typeof printPercent = (x, options = {}) => {
  return printPercent(x, { maximumFractionDigits: 1, ...options });
};

export const printPercent2FD: typeof printPercent = (x, options = {}) => {
  return printPercent(x, { maximumFractionDigits: 2, ...options });
};

export function printFiat(x: Big | number | string, currency = "USD", options?: NumberFormatOptions) {
  return printNumber(x, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
}

export function sqrtX96({ token0, token1 }: { token0: bigint; token1: bigint }) {
  const numerator = token1 << 192n;
  const denominator = token0;
  const ratioX192 = numerator / denominator;

  const sqrtX96 = Big(ratioX192.toString()).sqrt().toFixed(0, Big.roundDown).toString();

  return BigInt(sqrtX96);
}

export function applySlippage<T extends bigint | number>(
  amount: T,
  slippagePercentage: number | string,
  direction: "UP" | "DOWN" = "DOWN",
): T {
  const denominator = 1_000_000;
  const slippageFactor = Math.floor((Number(slippagePercentage) || 0) * (denominator / 100));

  const factor = direction === "UP" ? denominator + slippageFactor : Math.max(0, denominator - slippageFactor);

  if (typeof amount === "bigint") return ((amount * BigInt(factor)) / BigInt(denominator)) as T;

  return ((amount * factor) / denominator) as T;
}

export function tokenIdsFromRange(range: readonly [bigint, bigint]) {
  return Array.from({ length: Number(range[1] - range[0] + 1n) }, (_, i) => range[0] + BigInt(i));
}

export function normalizeRate(rate: string): bigint {
  // Remove % sign if present and convert to decimal
  const cleanRate = rate.replace("%", "");
  const rateAsDecimal = Number.parseFloat(cleanRate) / 100;
  const ratePerYear = BigInt(Math.floor(rateAsDecimal * 1e18));
  const secondsPerYear = 365n * 24n * 60n * 60n;

  return ratePerYear / secondsPerYear;
}

export function denormalizeRate(normalizedRate: bigint): number {
  const secondsPerYear = 365n * 24n * 60n * 60n;
  const ratePerYear = normalizedRate * secondsPerYear;
  const raw = Number(ratePerYear) / 1e18;

  // round to 4 decimal places
  return Math.round(raw * 1e4) / 1e4;
}
