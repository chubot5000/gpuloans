"use client";

import { PageWrapper } from "ui/components";

import { AddRecipientWhitelist } from "./AddRecipientWhitelist";
import { AdminNavCard } from "./AdminNavCard";
import { CreateBorrowerWalletButton } from "./CreateBorrowerWalletButton";

export function AdminPage() {
  return (
    <PageWrapper className="gap-6">
      <div className={"w-full max-w-3xl flex flex-col gap-3"}>
        <AdminNavCard href="/admin/applications">All Applications</AdminNavCard>
        <CreateBorrowerWalletButton />
        <AddRecipientWhitelist />
      </div>
    </PageWrapper>
  );
}
