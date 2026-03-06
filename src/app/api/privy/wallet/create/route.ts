import assert from "assert";

import { privyClient as client } from "data/clients/privy";
import { getAdmins } from "data/fetchers";
import { privyUserMetadataSchema } from "logic/hooks/privy/privyUserMetadata";
import { stringifyCustomMetadata } from "logic/hooks/privy/stringifyCustomMetadata";
import { syncWalletPolicies } from "logic/hooks/privy/syncWalletPolicies";
import { cookies as getCookies } from "next/headers";
import { NextResponse } from "next/server";
import { Address, HttpRequestError } from "viem";
import z from "zod";

const bodySchema = z.object({
  email: z.email(),
});

assert(process.env.NEXT_PUBLIC_USDAI_ADMIN_KQ_ID, "NEXT_PUBLIC_USDAI_ADMIN_KQ_ID is not set");
assert(process.env.NEXT_PUBLIC_USDAI_ADMIN_USER_ID, "NEXT_PUBLIC_USDAI_ADMIN_USER_ID is not set");
assert(process.env.NEXT_PUBLIC_PRIVY_MASTER_POLICY_ID, "NEXT_PUBLIC_PRIVY_MASTER_POLICY_ID is not set");
const masterPolicyId = process.env.NEXT_PUBLIC_PRIVY_MASTER_POLICY_ID;
const usdaiKQId = process.env.NEXT_PUBLIC_USDAI_ADMIN_KQ_ID;
// const adminUserId = process.env.NEXT_PUBLIC_USDAI_ADMIN_USER_ID;

export async function POST(req: Request) {
  const cookies = await getCookies();
  const privyIdToken = cookies.get("privy-id-token")?.value;

  if (!privyIdToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Unauthorized [Not Admin]" }, { status: 401 });
  }

  const rawBody = await req.json();
  const body = bodySchema.parse(rawBody);

  // get the borrower user and the usdai admin user
  const [borrowerUser] = await Promise.all([
    client
      .users()
      .getByEmailAddress({ address: body.email })
      .catch((error: HttpRequestError) => {
        if (error.status === 404) {
          return client.users().create({
            linked_accounts: [{ address: body.email, type: "email" }],
          });
        }

        throw error;
      }),
    // client
    //   .users()
    //   ._get(adminUserId)
    //   .catch(() => {
    //     throw new Error("USDAI Admin user not found");
    //   }),
  ]);

  const borrowerUserMetadata = privyUserMetadataSchema.parse(borrowerUser.custom_metadata);
  // const adminUserMetadata = privyUserMetadataSchema.parse(adminUser.custom_metadata);

  // get the admin key quorum and create the borrower key quorum
  const [globalAdminKQ, borrowerKQ] = await Promise.all([
    client
      .keyQuorums()
      .get(usdaiKQId)
      .catch(() => {
        throw new Error("Admin key quorum not found");
      }),
    // client
    //   .keyQuorums()
    //   .create({
    //     user_ids: [adminUser.id],
    //   })
    //   .catch(() => {
    //     throw new Error("Failed to create usdai admin key quorum");
    //   }),
    client
      .keyQuorums()
      .create({
        user_ids: [borrowerUser.id],
      })
      .catch(() => {
        throw new Error("Failed to create borrower key quorum");
      }),
  ]);

  const newWallet = await client
    .wallets()
    .create({
      chain_type: "ethereum",
      owner_id: globalAdminKQ.id,
      policy_ids: [masterPolicyId],
      additional_signers: [
        {
          signer_id: borrowerKQ.id,
        },
      ],
    })
    .catch(() => {
      throw new Error("Failed to create new wallet");
    });

  // the new wallet metadata
  const newWalletMetadata = {
    id: newWallet.id,
    address: newWallet.address.toLowerCase() as Address,
  } as const;

  // add the new wallet metadata to the borrower and usdai admin user metadata
  borrowerUserMetadata.linkedWallets.push({ ...newWalletMetadata, kQId: borrowerKQ.id, recipients: [] });
  // adminUserMetadata.linkedWallets.push({ ...newWalletMetadata, kQId: adminKQ.id, recipients: [] });

  // update the borrower and usdai admin user metadata
  await Promise.all([
    client.users().setCustomMetadata(borrowerUser.id, {
      custom_metadata: stringifyCustomMetadata(borrowerUserMetadata),
    }),
    // client.users().setCustomMetadata(adminUser.id, {
    //   custom_metadata: stringifyCustomMetadata(adminUserMetadata),
    // }),
  ]);

  await syncWalletPolicies(newWallet, []);

  return NextResponse.json({
    walletId: newWallet.id,
    walletAddress: newWallet.address.toLowerCase() as Address,
    borrowerKQId: borrowerKQ.id,
    // adminKQId: adminKQ.id,
  });
}
