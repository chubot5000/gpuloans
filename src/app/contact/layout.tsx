import type { Metadata } from "next";

import "ui/styles/globals.css";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <div className="flex overflow-hidden flex-col min-h-screen">
      <main className="flex overflow-y-auto flex-1 w-full">
        <div className="flex relative flex-1 justify-center w-full">{children}</div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Get a Quote",
  alternates: {
    canonical: "/contact",
  },
};
