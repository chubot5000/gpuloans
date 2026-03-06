"use client";

import { usePrivyAccount } from "logic/components";
import { cn } from "logic/utils";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "ui/components";

export function EmailRow({ className = "" }) {
  const { user } = usePrivyAccount();

  return (
    <div className={cn("flex h-12 items-center gap-3.5 border border-outline-major px-4", className)}>
      <MailIcon className="size-5" />

      <span className={cn("w-0 grow truncate font-normal", { "text-text-secondary": !user.email })}>
        {user.email ? user.email.address : "No email linked"}
      </span>

      <LinkEmail />
    </div>
  );
}

function LinkEmail({ className = "" }) {
  const { user, linkEmail, unlinkEmail, canUnlink } = usePrivyAccount();

  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    if (!user) return;

    if (user.email) {
      setIsLoading(true);
      await unlinkEmail(user.email.address);
      setIsLoading(false);
    } else linkEmail();
  }

  if (!user) return null;

  return (
    <Button
      className={cn("btn btn-small", { "btn-primary": !user.email, "btn-secondary": Boolean(user.email) }, className)}
      disabled={Boolean(user.email && !canUnlink)}
      isLoading={isLoading}
      onClick={onClick}
    >
      {user.email ? "Unlink" : "Link"}
    </Button>
  );
}
