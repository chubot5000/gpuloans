import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable source maps in production for debugging and Lighthouse insights
  productionBrowserSourceMaps: true,
  async headers() {
    // Strict CSP with required external domains
    const isDev = process.env.NODE_ENV === "development";

    const csp = [
      "default-src 'self'",
      // Note: inline scripts exist in the app (theme init + analytics config), so 'unsafe-inline' is required here
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://analytics.ahrefs.com https://tag.safary.club https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net https://unpkg.com https://assets.calendly.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.reown.com https://assets.calendly.com",
      "img-src 'self' https://explorer-api.walletconnect.com data: blob: https://cdn-icons-png.flaticon.com https://res.cloudinary.com https://humble-frogs-a5378764e2.strapiapp.com https://humble-frogs-a5378764e2.media.strapiapp.com https://assets.calendly.com https://zggcmphqypwbbvpexdet.supabase.co",
      "font-src 'self' https://fonts.gstatic.com https://fonts.reown.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      // Privy / WalletConnect / Calendly iframes
      "child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://calendly.com",
      "frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://calendly.com",
      // Network endpoints used by the app (HTTP(S) + WebSocket)
      `connect-src 'self' ${process.env.NEXT_PUBLIC_BACKEND_API_URL} https://analytics.ahrefs.com https://pulse.walletconnect.org https://api.web3modal.org https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://pro-api.coingecko.com https://gateway.thegraph.com https://subgraph.satsuma-prod.com https://scan.layerzero-api.com https://scan-testnet.layerzero-api.com https://api-v2.pendle.finance https://*.g.alchemy.com https://www.google-analytics.com https://tag.safary.club https://*.usd.ai https://cdn.jsdelivr.net https://unpkg.com https://calendly.com https://assets.calendly.com https://kyb.ui.idenfy.com https://humble-frogs-a5378764e2.strapiapp.com https://humble-frogs-a5378764e2.media.strapiapp.com https://zggcmphqypwbbvpexdet.supabase.co`,
      // Workers and manifest
      "worker-src 'self'",
      "manifest-src 'self'",
      // Media (tutorial videos hosted via Vimeo progressive links)
      "media-src 'self' https://player.vimeo.com blob: data:",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  // "eslint": {
  //   ignoreDuringBuilds: true,
  // },
  experimental: {
    inlineCss: true,
    optimizePackageImports: [
      "@headlessui/react",
      "@heroicons/react",
      "@privy-io/react-auth",
      "@tanstack/react-query",
      "country-state-city",
      "date-fns",
      "framer-motion",
      "lodash",
      "lucide-react",
      "react-phone-number-input",
      "viem",
      "wagmi",
      "zod",
    ],
  },
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "humble-frogs-a5378764e2.media.strapiapp.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
