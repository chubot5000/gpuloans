"use client";

import { useLoginWithEmail } from "@privy-io/react-auth";
import { MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Input } from "ui/components";
import z from "zod";

import { OTPInput } from "./OTPInput";
import { TERMS_ACCEPTED_KEY, TermsCheckbox } from "./TermsCheckbox";

export function EmailLogin() {
  const { loginWithCode, state: otpStatus } = useLoginWithEmail();
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (otpStatus.status === "error" && !error) {
      setError(otpStatus.error?.message ?? "Failed to send code");
    }
  }, [otpStatus, error]);

  const onEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  const onPasscodeChange = (value: string) => {
    setPasscode(value);
    setError(null);
  };

  const onLogin = async () => {
    if (!z.email().safeParse(email).success) {
      setError("Invalid email address");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    await loginWithCode({ code: passcode })
      .then(() => {
        localStorage.setItem(TERMS_ACCEPTED_KEY, "true");
      })
      .catch((error: { privyErrorCode: string }) => {
        if (error.privyErrorCode === "invalid_credentials") {
          setError("Invalid passcode");
        } else {
          setError("Failed to login");
        }
      });
  };

  return (
    <>
      {/* Email Input */}
      <EmailInput email={email} onEmailChange={onEmailChange} />

      {/* OTP Input */}
      <OTPInput email={email} passcode={passcode} setPasscode={onPasscodeChange} />

      {/* Terms Checkbox */}
      <TermsCheckbox agreedToTerms={agreedToTerms} onAgreedToTermsChange={setAgreedToTerms} />

      {/* Login Button */}
      <div className="flex flex-col gap-1 mt-auto relative">
        <Button
          isLoading={otpStatus.status === "submitting-code"}
          onClick={onLogin}
          disabled={!email || !agreedToTerms || passcode.length !== 6}
          className="w-full btn-primary-light"
        >
          Login
        </Button>
        {error ? <p className="text-red-300 text-sm mb-2 absolute -bottom-8">{error}</p> : null}
      </div>
    </>
  );
}

function EmailInput(props: { email: string; onEmailChange: (value: string) => void; onEmailSubmit?: () => void }) {
  const { email, onEmailChange, onEmailSubmit } = props;
  const { sendCode, state: otpStatus } = useLoginWithEmail();

  return (
    <div className="mb-4">
      <Input
        id="email-input"
        type="text"
        autoComplete="email"
        value={email}
        onChange={onEmailChange}
        onEnter={onEmailSubmit}
        placeholder="your@email.com"
        leading={<MailIcon className="size-5 stroke-[1.5px] text-fill-secondary ml-3" />}
        className="border-outline-minor"
        inputClassName="text-text-dark-primary placeholder:text-text-dark-secondary tracking-normal"
        trailing={
          <div className="flex items-center justify-center mr-3">
            <Button
              isLoading={otpStatus.status === "sending-code"}
              disabled={!z.email().safeParse(email).success}
              type="button"
              onClick={() => sendCode({ email })}
              className="h-7 px-3 font-normal btn-secondary text-sm whitespace-nowrap"
            >
              Get Code
            </Button>
          </div>
        }
      />
    </div>
  );
}
