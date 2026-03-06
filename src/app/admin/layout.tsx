import { privyClient } from "data/clients/privy";
import { getAdmins } from "data/fetchers";
import { Layout } from "logic/components";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import "ui/styles/globals.css";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Readonly<Props>) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("privy-id-token")?.value;

  if (!idToken) return notFound();

  const admins = await getAdmins();
  const user = await privyClient.users().get({ id_token: idToken });

  const email = user.linked_accounts.find((a) => a.type === "email")?.address;
  if (!email || !admins.includes(email.toLowerCase())) return notFound();

  return <Layout>{children}</Layout>;
}

export const metadata: Metadata = {
  title: "Admin - Applications",
};
