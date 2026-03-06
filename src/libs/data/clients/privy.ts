import assert from "assert";
import { Console } from "console";

import { PrivyClient } from "@privy-io/node";

assert(process.env.NEXT_PUBLIC_PRIVY_APP_ID, "NEXT_PUBLIC_PRIVY_APP_ID is not set");
assert(process.env.PRIVY_GPULOANS_APP_SECRET, "PRIVY_GPULOANS_APP_SECRET is not set");

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_GPULOANS_APP_SECRET;

export const privyClient = new PrivyClient({
  appId: privyAppId,
  appSecret: privyAppSecret,
  logLevel: "debug",
  logger: new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    inspectOptions: {
      depth: null,
    },
  }),
});
