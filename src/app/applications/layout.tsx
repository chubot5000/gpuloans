import { Layout } from "logic/components";
import type { Metadata } from "next";
import { PageWrapper } from "ui/components";

import "ui/styles/globals.css";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <Layout>
      <PageWrapper>{children}</PageWrapper>
    </Layout>
  );
}

export const metadata: Metadata = {
  title: "Applications",
};
