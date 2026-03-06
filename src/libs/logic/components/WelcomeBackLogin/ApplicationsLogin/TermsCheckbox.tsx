"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Radio } from "ui/components";

export function TermsCheckbox(props: { agreedToTerms: boolean; onAgreedToTermsChange: (checked: boolean) => void }) {
  const { agreedToTerms, onAgreedToTermsChange } = props;
  const [hasAcceptedBefore, setHasAcceptedBefore] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check localStorage on mount
    const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY);
    if (accepted === "true") {
      setHasAcceptedBefore(true);
      onAgreedToTermsChange(true);
    }
  }, [onAgreedToTermsChange]);

  if (!isClient || hasAcceptedBefore) return null;

  return (
    <label className="flex items-start gap-2 mb-6">
      <Radio
        checked={agreedToTerms}
        size="sm"
        onChange={(e) => onAgreedToTermsChange(e.target.checked)}
        className="mt-0.5 border-fill-primary text-brown-900 focus:ring-brown-500"
      />
      <div className="text-sm tracking-tight text-dark-primary">
        <span>By logging into your account, you agree to our</span>
        <br />
        <span className="text-brown-500">
          <Link href="/terms" className="underline hover:text-brown-700">
            Terms and Conditions
          </Link>
          <span> and </span>
          <Link href="/privacy" className="underline hover:text-brown-700">
            Privacy Policy
          </Link>
        </span>
      </div>
    </label>
  );
}

export const TERMS_ACCEPTED_KEY = "gpuloans_terms_accepted";
