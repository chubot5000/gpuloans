import { Layout } from "logic/components";
import type { Metadata } from "next";

import "ui/styles/globals.css";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return <Layout className="min-h-main">{children}</Layout>;
}

export const metadata: Metadata = {
  title: "Login",
};
