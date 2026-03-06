export const dynamic = "force-dynamic";

import { Footer } from "logic/components";
import { NewHomepage } from "logic/pages";
import { siteConfig } from "logic/utils";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GPULoans",
  url: siteConfig.url,
  logo: `${siteConfig.url}/svg/gpu-loans-logo.svg`,
  sameAs: ["https://twitter.com/USDai_Official"],
  "@id": `${siteConfig.url}/#organization`,
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="flex flex-col items-center min-h-screen">
        <NewHomepage />

        <Footer />
      </div>
    </>
  );
}
