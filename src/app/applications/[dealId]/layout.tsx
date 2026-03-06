import type { Metadata } from "next";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: "Application",
};
