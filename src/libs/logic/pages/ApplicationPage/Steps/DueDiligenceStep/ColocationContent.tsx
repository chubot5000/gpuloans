"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { COLOCATIONAGREEMENT_STATUS, CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { type StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { useState } from "react";
import { FileUpload, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { DocumentId } from "../../core/constants";

import { COLOCATION_MESSAGES } from "./constants";

interface ColocationContentProps {
  state: StepState;
}

export function ColocationContent({ state }: ColocationContentProps) {
  const { dealId } = useApplication();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.COLOCATION_AGREEMENT],
    queryFn: () => getTaskFile(dealId, DocumentId.COLOCATION_AGREEMENT),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
  });

  async function handleUpload(files: File[]) {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      await Promise.all(
        files.map((file) => {
          const formData = new FormData();
          formData.append("file", file);

          return uploadPipedriveDealFile({
            fileData: formData,
            dealId,
            fieldKey: CUSTOM_FIELD_KEYS.COLOCATIONAGREEMENT_STATUS,
            statusOptionId: COLOCATIONAGREEMENT_STATUS["Under Review"],
            documentId: DocumentId.COLOCATION_AGREEMENT,
          });
        }),
      );

      await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
      await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.COLOCATION_AGREEMENT] });
    } catch (error) {
      console.error("Failed to upload colocation files:", error);
    } finally {
      setIsUploading(false);
    }
  }

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={COLOCATION_MESSAGES[state]} />}

      <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
        {state === "TODO" && (
          <FileUpload accept={{ "application/pdf": [".pdf"] }} onUpload={handleUpload} disabled={isUploading} />
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <Spinner className="size-7" />
          </div>
        ) : (
          <FileList files={files} showEmptyState={state === "COMPLETED"} />
        )}
      </div>
    </div>
  );
}
