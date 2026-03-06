"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, TERMSHEET_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { useAdmin, type StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { LockIcon } from "lucide-react";

import { DocumentExecution } from "../../components";
import { DocumentId, TaskId } from "../../core/constants";
import { TEMPLATES_DOCS } from "../template_docs";

const STATE_MESSAGES = {
  TODO: "Please review the Term Sheet and provide your signature. Download the template",
  PENDING: "Term Sheet is currently under review.",
  COMPLETED: "Term Sheet has been executed.",
  REJECTED: "Term Sheet was rejected. Please contact support.",
  UW_COMMENTS: "Borrower has signed the Term Sheet.",
};

interface TermSheetProps {
  state: StepState;
}

export function TermSheet(props: TermSheetProps) {
  const { state } = props;
  const { dealId, dealDetail } = useApplication();
  const { isAdminMode } = useAdmin();
  const config = TEMPLATES_DOCS[TaskId.TERM_SHEET]!;

  const queryClient = useQueryClient();

  const viewAndSignUrl = dealDetail.custom_fields?.termSheetOverride ?? null;

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.TERM_SHEET],
    queryFn: () => getTaskFile(dealId, DocumentId.TERM_SHEET),
    enabled: state !== "UNAVAILABLE",
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.TERMSHEET_STATUS,
      statusOptionId: TERMSHEET_STATUS["Needs Review"],
      documentId: DocumentId.TERM_SHEET,
      description: `${DocumentId.TERM_SHEET}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.TERM_SHEET] });
  }

  let node: React.ReactNode = null;

  if (state === "UNAVAILABLE") {
    node = (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center px-4 h-11 bg-bg-primary">
          <LockIcon className="size-4 shrink-0 text-text-secondary" />
          <span className="text-sm tracking-tight text-text-secondary">This step is locked</span>
        </div>

        <span className="text-sm">This step will be available after all Borrower Intake tasks are completed.</span>
      </div>
    );
  } else
    node = (
      <DocumentExecution
        taskId={TaskId.TERM_SHEET}
        state={state}
        viewAndSignUrl={viewAndSignUrl}
        downloadUrl={null}
        files={files}
        isLoading={isLoading}
        onUpload={handleUpload}
        stateMessages={STATE_MESSAGES}
      />
    );

  return (
    <div className="flex flex-col gap-5">
      {node}

      {state !== "COMPLETED" && (
        <>
          <hr className="my-1" />

          <p className="text-sm text-text-dark-primary">You can download and view Term Sheet templates here:</p>

          <div className="flex flex-col gap-5">
            <a
              href={config.docURLs[1]}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit inline-flex items-center gap-1.5 text-sm text-fill-secondary border-b border-fill-secondary"
            >
              US Borrowers - Term Sheet Template
              <ArrowDownTrayIcon className="size-4" />
            </a>
            <a
              href={config.docURLs[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit inline-flex items-center gap-1.5 text-sm text-fill-secondary border-b border-fill-secondary"
            >
              Non-US Borrowers - Term Sheet Template
              <ArrowDownTrayIcon className="size-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
