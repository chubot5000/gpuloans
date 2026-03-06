import assert from "assert";

import { PrivyPoliciesService, Wallet } from "@privy-io/node";
import { privyClient as client } from "data/clients/privy";
import { uniqBy } from "lodash";
import { OAdapterAbi, UsdaiAbi } from "logic/pages/LoansPage/contracts";
import { truncateAddress } from "logic/utils";
import { erc20Abi, erc721Abi, getAbiItem, getAddress } from "viem";

import { createPolicyUpdateIntent, createWalletUpdateIntent } from "./utils";

export async function syncWalletPolicies(wallet: Wallet, recipient: string[]) {
  const walletId = wallet.id;
  const policy: Required<Omit<PrivyPoliciesService.UpdateInput, "owner" | "authorization_context">> = {
    name: `[${truncateAddress(wallet.address)}] Policy`,
    owner_id: usdaiKQId,
    rules: [
      createCollateralRule([...addresses.collections], [...addresses.bundleCW, ...addresses.loanRouter]),
      createBundleCWRule([...addresses.bundleCW]),
      createLoanRouterRule([...addresses.loanRouter]),
      createERC20Rule(
        [...addresses.erc20s.map(({ token }) => token)],
        [...addresses.erc20s.map(({ adapter }) => adapter), ...addresses.loanRouter, ...addresses.usdais],
      ),
      createUSDaiRule([...addresses.usdais]),
      createLzAdapterRule(
        [...addresses.erc20s.map(({ adapter }) => adapter)],
        uniqBy([...recipient, wallet.address], (address) => address.toLowerCase()),
      ),
    ],
  };

  const currentWalletPolicyId = wallet.policy_ids?.[0];
  if (currentWalletPolicyId) {
    await createPolicyUpdateIntent(currentWalletPolicyId, policy);
    return;
  }

  const newPolicy = await client.policies().create({ ...policy, chain_type: "ethereum", version: "1.0" });

  await createWalletUpdateIntent(walletId, {
    policy_ids: [newPolicy.id],
    additional_signers: wallet.additional_signers.map((signer) => ({
      signer_id: signer.signer_id,
    })),
  });
}

const addresses = {
  collections: [
    // Testnet
    "0x3942e4C85DA02C1320BdE320aB3b2F40d7D6488D", // sep collateral 1
    "0x786F64060cd4266D7614786F79fD9e501ab79ac8", // sep collateral 2
    // Mainnet
    "0xb31F04f920F24EdA3Ad276D55c5afEFad6230c5D", // arb collateral
    "0x5FCC3dB106DD173eFa457360B401fe66e296c0da", // arb test nft
  ],
  bundleCW: [
    // Testnet
    "0x1AF7C21bB3abE1Adc33b941D1Aee2a83848C8DEE", // sep bundleCW
    // Mainnet
    "0x80E3146FB2328fE1b79f92F5a3a6bF35515AEe37", // arb bundleCW
  ],
  loanRouter: [
    // Testnet
    "0x399089e1D8a1a30E6A497f5885147A807B998183", // sep loanRouter
    // Mainnet
    "0x0C2ED170F2bB1DF1a44292Ad621B577b3C9597D1", // arb loanRouter
  ],
  usdais: [
    // Testnet
    "0xeb29fbaa2d509e43313c196a82f4ad75fa251285", // sep usdai
    // Mainnet
    "0x0a1a1a107e45b7ced86833863f482bc5f4ed82ef", // arb usdai
  ],
  erc20s: [
    // Testnet
    {
      // sep USDC
      token: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
      adapter: "0x4985b8fcea3659fd801a5b857da1d00e985863f0",
    },
    {
      // arb sep USDC
      token: "0x3253a335e7bffb4790aa4c25c4250d206e9b9773",
      adapter: "0x543bda7c6ca4384fe90b1f5929bb851f52888983",
    },
    // Mainnet
    {
      // arb PYUSD
      token: "0x46850aD61C2B7d64d08c9C754F45254596696984",
      adapter: "0xfab5891ed867a1195303251912013b92c4fc3a1d",
    },
    {
      // eth PYUSD
      token: "0x6c3ea9036406852006290770bedfcaba0e23a0e8", // eth PYUSD
      adapter: "0xa2c323fe5a74adffad2bf3e007e36bb029606444",
    },
  ],
} as const;

function createCollateralRule(collaterals: string[], spenders: string[]): PrivyPoliciesService.CreateRuleInput {
  return {
    name: "Whitelist collaterals [sepolia, arbitrum]",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: collaterals.map((collateral) => getAddress(collateral)),
      },
      {
        field_source: "ethereum_calldata",
        field: "setApprovalForAll.operator",
        operator: "in",
        value: spenders.map((bundler) => getAddress(bundler)),
        abi: [getAbiItem({ abi: erc721Abi, name: "setApprovalForAll" })],
      },
    ],
  };
}

function createBundleCWRule(bundlers: string[]): PrivyPoliciesService.CreateRuleInput {
  return {
    name: "Whitelist loan router [sepolia, arbitrum]",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: bundlers.map((bundler) => getAddress(bundler)),
      },
    ],
  };
}

function createLoanRouterRule(loanRouters: string[]): PrivyPoliciesService.CreateRuleInput {
  return {
    name: "Whitelist bundleCW [sepolia, arbitrum]",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: loanRouters.map((loanRouter) => getAddress(loanRouter)),
      },
    ],
  };
}

function createERC20Rule(tokens: string[], spenders: string[]): PrivyPoliciesService.CreateRuleInput {
  // spenders are the loanRouters and lzAdapters, usdais
  return {
    name: "ERC20 Approve to loanRouters, LzAdapters, USDais",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: tokens.map((token) => getAddress(token)),
      },
      {
        field_source: "ethereum_calldata",
        field: "approve.spender",
        operator: "in",
        value: spenders.map((spender) => getAddress(spender)),
        abi: [getAbiItem({ abi: erc20Abi, name: "approve" })],
      },
    ],
  };
}

function createUSDaiRule(usdais: string[]): PrivyPoliciesService.CreateRuleInput {
  return {
    name: "Whitelist USDai [sepolia, arbitrum]",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: usdais.map((usdai) => getAddress(usdai)),
      },
      {
        field_source: "ethereum_calldata",
        field: "function_name",
        operator: "eq",
        value: "deposit",
        abi: [getAbiItem({ abi: UsdaiAbi, name: "deposit" })],
      },
    ],
  };
}

function createLzAdapterRule(adapters: string[], recipients: string[]): PrivyPoliciesService.CreateRuleInput {
  return {
    name: "allow LzAdapters",
    method: "eth_sendTransaction",
    action: "ALLOW",
    conditions: [
      {
        field_source: "ethereum_transaction",
        field: "to",
        operator: "in",
        value: adapters.map((adapter) => getAddress(adapter)),
      },
      {
        field_source: "ethereum_calldata",
        field: "send._refundAddress",
        operator: "in",
        value: recipients.map((recipient) => getAddress(recipient)),
        abi: [getAbiItem({ abi: OAdapterAbi, name: "send" })],
      },
    ],
  };
}

assert(process.env.NEXT_PUBLIC_USDAI_ADMIN_KQ_ID, "NEXT_PUBLIC_USDAI_ADMIN_KQ_ID is not set");
const usdaiKQId = process.env.NEXT_PUBLIC_USDAI_ADMIN_KQ_ID;
