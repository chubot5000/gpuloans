"use client";

import { useLoginWithEmail } from "@privy-io/react-auth";
import { cn } from "logic/utils";
import { Input } from "ui/components";

interface OTPStepProps {
  email: string;
  passcode: string;
  setPasscode: (value: string) => void;
}

export function PasscodeInput(props: { passcode: string; onPasscodeChange: (value: string) => void }) {
  const { passcode, onPasscodeChange } = props;
  const { state: otpStatus } = useLoginWithEmail();

  const isDisabled = otpStatus.status !== "awaiting-code-input" && otpStatus.status !== "error";

  const handleChange = (value: string) => {
    // Only allow numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Limit to 6 digits
    const limitedValue = numericValue.slice(0, 6);
    onPasscodeChange(limitedValue);
  };

  return (
    <Input
      type="text"
      max={6}
      value={passcode}
      onChange={handleChange}
      placeholder="Enter the one-time 6-digit passcode"
      disabled={isDisabled}
      maxLength={6}
      inputMode="numeric"
      pattern="[0-9]*"
      className="border-outline-minor rounded-none !bg-white"
      inputClassName="text-brown-900 placeholder:text-dark-secondary px-4 py-1"
    />
  );
}

export function OTPInput(props: OTPStepProps) {
  const { email, passcode, setPasscode } = props;

  const { sendCode, state: otpStatus } = useLoginWithEmail();

  return (
    <div className="relative mb-8">
      {/* Passcode Input */}
      <PasscodeInput passcode={passcode} onPasscodeChange={setPasscode} />

      {/* Help Text */}
      <p
        className={cn("text-xs text-stone-500 absolute -bottom-6", {
          hidden: otpStatus.status !== "awaiting-code-input",
        })}
      >
        Didn&apos;t get an email? Check spam from privy.io or{" "}
        <button
          type="button"
          onClick={() => sendCode({ email })}
          className="underline text-fill-secondary hover:text-brown-900"
        >
          Resend Code
        </button>
      </p>
    </div>
  );
}
