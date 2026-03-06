"use server";

import assert from "assert";

import { privyClient as client } from "data/clients/privy";
import { getAdmins } from "data/fetchers";
import { privyUserMetadataSchema } from "logic/hooks/privy/privyUserMetadata";
import { stringifyCustomMetadata } from "logic/hooks/privy/stringifyCustomMetadata";
import { syncWalletPolicies } from "logic/hooks/privy/syncWalletPolicies";
import { cookies as getCookies } from "next/headers";
import { Address, isAddressEqual } from "viem";

interface WhitelistRecipientParams {
  borrowerEmail: string;
  borrowerAddress: Address;
  recipientAddress: Address;
}

assert(process.env.NEXT_PUBLIC_USDAI_ADMIN_USER_ID, "NEXT_PUBLIC_USDAI_ADMIN_USER_ID is not set");
const adminUserId = process.env.NEXT_PUBLIC_USDAI_ADMIN_USER_ID;

export async function whitelistRecipient(params: WhitelistRecipientParams) {
  const { borrowerEmail, borrowerAddress, recipientAddress } = params;

  const cookies = await getCookies();
  const privyIdToken = cookies.get("privy-id-token")?.value;

  if (!privyIdToken) {
    throw new Error("Unauthorized");
  }
  // get allowed admins, and request caller email
  const [gpuLoansAdmins, callerEmail] = await Promise.all([
    getAdmins(),
    client
      .users()
      .get({ id_token: privyIdToken })
      .then((user) => user.linked_accounts.find((a) => a.type === "email")?.address),
  ]);

  if (!callerEmail || !gpuLoansAdmins.includes(callerEmail.toLowerCase())) {
    throw new Error("Unauthorized [Not Admin]");
  }

  const [borrowerUser, adminUser] = await Promise.all([
    client.users().getByEmailAddress({ address: borrowerEmail }),
    client.users()._get(adminUserId),
  ]);

  if (!borrowerUser || !adminUser) {
    throw new Error(`${!borrowerUser ? "Borrower" : "Admin"} user not found`);
  }

  const borrowerUserMetadata = privyUserMetadataSchema.parse(borrowerUser.custom_metadata);
  const adminUserMetadata = privyUserMetadataSchema.parse(adminUser.custom_metadata);

  const borrowerWalletMetadata = borrowerUserMetadata.linkedWallets.find((w) =>
    isAddressEqual(w.address, borrowerAddress),
  );
  const adminWalletMetadata = adminUserMetadata.linkedWallets.find((w) => isAddressEqual(w.address, borrowerAddress));

  if (!borrowerWalletMetadata) throw new Error(`Borrower wallet not found in user metadata`);

  // get wallet
  const wallet = await client.wallets().get(borrowerWalletMetadata.id);

  const promises: Promise<unknown>[] = [
    syncWalletPolicies(wallet, [...borrowerWalletMetadata.recipients, recipientAddress]),
  ];
  // add recipient to borrower wallet
  if (borrowerWalletMetadata && !borrowerWalletMetadata.recipients.some((r) => isAddressEqual(r, recipientAddress))) {
    borrowerWalletMetadata.recipients.push(recipientAddress);
    promises.push(
      client.users().setCustomMetadata(borrowerUser.id, {
        custom_metadata: stringifyCustomMetadata(borrowerUserMetadata),
      }),
    );
  }

  // add recipient to admin wallet
  if (adminWalletMetadata && !adminWalletMetadata.recipients.some((r) => isAddressEqual(r, recipientAddress))) {
    adminWalletMetadata.recipients.push(recipientAddress);
    promises.push(
      client.users().setCustomMetadata(adminUser.id, {
        custom_metadata: stringifyCustomMetadata(adminUserMetadata),
      }),
    );
  }

  // update the borrower and/or admin user metadata
  await Promise.all(promises);

  return {
    success: true,
    message: "Recipient whitelisted successfully",
  };
}
