"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, SPVONESTOP_STATUS } from "data/clients/pipedrive/constants.generated";
import { uploadPipedriveDealFile, type PipedriveFile } from "data/fetchers";
import type { StepState } from "logic/components";
import Link from "next/link";

import { useApplication } from "../../ApplicationPageProvider";
import { FileUpload } from "../../components/DocumentExecution/FileUpload";
import { DocumentId } from "../../core";
import { SPV_DOCUMENTS } from "../template_docs";

interface SelfManagedSPVProps {
  state: StepState;
  files: PipedriveFile[] | undefined;
  isLoading: boolean;
}

export function SelfManagedSPV(props: SelfManagedSPVProps) {
  const { state } = props;
  const { dealId } = useApplication();
  const queryClient = useQueryClient();
  const showUploadSection = state === "TODO" || state === "UW_COMMENTS";

  async function handleUpload(files: File[]) {
    if (files.length === 0) return;

    try {
      await Promise.all(
        files.map((file) => {
          const formData = new FormData();
          formData.append("file", file);

          return uploadPipedriveDealFile({
            fileData: formData,
            dealId,
            fieldKey: CUSTOM_FIELD_KEYS.SPVONESTOP_STATUS,
            statusOptionId: SPVONESTOP_STATUS["Under Review"],
            documentId: DocumentId.LLC_AGREEMENT,
          });
        }),
      );

      await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
      await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.LLC_AGREEMENT] });
    } catch (error) {
      console.error("Failed to upload colocation files:", error);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-dark-primary">
        Please upload your executed SPV LLC documents. You can download templates below for reference.
      </p>
      Document List
      <div className="flex flex-col gap-5">
        {SPV_DOCUMENTS.map(({ id, name, viewUrl, downloadUrl }) => (
          <div
            key={id}
            className="flex items-center justify-between px-5 min-h-[52px] border border-outline-minor bg-white"
          >
            <span className="text-sm text-text-dark-primary">{name}</span>
            <div className="flex gap-4 items-center">
              <Link
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors text-text-secondary hover:text-text-primary"
              >
                View
              </Link>
              <span className="text-outline-minor">|</span>
              <Link
                href={downloadUrl}
                download
                className="flex gap-2 items-center text-sm transition-colors text-text-secondary hover:text-text-primary"
              >
                Download
              </Link>
            </div>
          </div>
        ))}
      </div>
      {showUploadSection && <FileUpload onUpload={handleUpload} multiple />}
    </div>
  );
}
