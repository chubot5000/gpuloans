import { siteConfig } from "logic/utils";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/loans/", "/applications/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
