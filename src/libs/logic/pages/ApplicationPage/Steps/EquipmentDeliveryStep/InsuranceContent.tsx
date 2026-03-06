"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ASSETS_ADDED_TO_MASTER_INSURANCE } from "data/clients/pipedrive/constants.generated";
import { CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import type { StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { FileUpload, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { DocumentId } from "../../core/constants";

const STATE_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "GPULoans will work with our service provider to confirm that the proposed assets will be covered under the GPULoans Master Insurance Policy. Once your assets are approved, this step will be marked Complete (green text). If not, we will contact you to discuss next steps.",
  PENDING: "Your insurance documentation is being reviewed.",
  REJECTED: "Insurance documentation was rejected.",
};

interface InsuranceContentProps {
  state: StepState;
}

export function InsuranceContent({ state }: InsuranceContentProps) {
  const { dealId } = useApplication();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.INSURANCE],
    queryFn: () => getTaskFile(dealId, DocumentId.INSURANCE),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
  });

  async function handleFilesChange(files: File[]) {
    if (files.length === 0) return;

    await Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);

        return uploadPipedriveDealFile({
          fileData: formData,
          dealId,
          fieldKey: CUSTOM_FIELD_KEYS.ASSETS_ADDED_TO_MASTER_INSURANCE,
          statusOptionId: ASSETS_ADDED_TO_MASTER_INSURANCE["Under Review"],
          documentId: DocumentId.INSURANCE,
        });
      }),
    );

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({
      queryKey: ["deal-file", dealId, DocumentId.INSURANCE],
    });
  }

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={STATE_MESSAGES[state]} />}

      {state === "TODO" && (
        <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} onUpload={handleFilesChange} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner className="size-7" />
        </div>
      ) : (
        <FileList files={files} showEmptyState={state === "COMPLETED"} />
      )}
    </div>
  );
}
