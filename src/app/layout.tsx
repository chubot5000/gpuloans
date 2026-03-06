export const dynamic = "force-dynamic";

import { AppProviders } from "logic/components";
import { siteConfig } from "logic/utils";
import type { Metadata } from "next";
import { polar, ppEiko, ppMuseum, swissNow } from "ui/fonts";
import "ui/styles/globals.css";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html
      className={`${swissNow.variable} ${ppEiko.variable} ${ppMuseum.variable} ${polar.variable} font-swiss`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JMYH1TPNSD"></script>
        <script async src="https://analytics.ahrefs.com/analytics.js" data-key="59o8xIdCiVNuxyeFjn6LNQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JMYH1TPNSD');
            `,
          }}
        />
      </head>
      <body className="w-full min-h-screen text-sm bg-bg-page touch-manipulation text-text-primary">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`/images/og_image.png`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`/images/og_image.png`],
    site: siteConfig.url,
    creator: "@USDai_Official",
  },
};
