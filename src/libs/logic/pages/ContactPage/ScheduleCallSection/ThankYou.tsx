"use client";

import { TaskId } from "logic/pages/ApplicationPage";
import { TEMPLATES_DOCS } from "logic/pages/ApplicationPage/Steps/template_docs";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "ui/components";

interface ThankYouProps {
  dealId: number;
}

export function ThankYou({ dealId }: ThankYouProps) {
  return (
    <div className="flex flex-col w-full">
      <Link
        href="/"
        className="hidden gap-2 items-center mb-10 transition-colors text-secondary md:flex w-fit hover:text-primary"
      >
        <ChevronLeftIcon className="w-5 h-5 rotate-0" />
        Back
      </Link>

      <h1 className="font-eiko italic text-[36px] font-medium text-text-dark-primary mb-8">Thank You</h1>

      <div className="flex flex-col gap-3 mb-6 text-lg font-light text-primary">
        <p>Your call is booked and a copy was sent to your email.</p>
        <p>We look forward to learning more!</p>
      </div>

      <div className="h-px bg-outline-minor w-full max-w-[440px] mb-8" />

      <div className="flex flex-col gap-3 mb-6 text-lg font-light text-primary">
        <p>
          Prior to the call, please sign our{" "}
          <Link
            href={TEMPLATES_DOCS[TaskId.NDA]!.docURLs[0]}
            className="text-[#4BA3E3] hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NDA"
          >
            MNDA on Docusign <ExternalLinkIcon className="w-4 h-4" />
          </Link>
        </p>

        <p>
          Please contact{" "}
          <Link href="mailto:hello@gpuloans.com" className="text-text-dark-primary hover:underline">
            hello@gpuloans.com
          </Link>{" "}
          with any questions.
        </p>
      </div>

      <Button as={Link} href={`/applications/${dealId}`} className="w-full h-12 md:w-60">
        Application Home
      </Button>
    </div>
  );
}
