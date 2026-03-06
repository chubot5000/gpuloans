"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, DATACENTERONEPAGER_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { type StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { FileUpload, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { DocumentId } from "../../core/constants";

import { ONE_PAGER_MESSAGES } from "./constants";

interface OnePagerContentProps {
  state: StepState;
}

export function OnePagerContent({ state }: OnePagerContentProps) {
  const { dealId } = useApplication();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.DATA_CENTER_ONE_PAGER],
    queryFn: () => getTaskFile(dealId, DocumentId.DATA_CENTER_ONE_PAGER),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
  });

  async function handleUpload(files: File[]) {
    if (files.length === 0) return;

    await Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);

        return uploadPipedriveDealFile({
          fileData: formData,
          dealId,
          fieldKey: CUSTOM_FIELD_KEYS.DATACENTERONEPAGER_STATUS,
          statusOptionId: DATACENTERONEPAGER_STATUS["Under Review"],
          documentId: DocumentId.DATA_CENTER_ONE_PAGER,
        });
      }),
    );

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.DATA_CENTER_ONE_PAGER] });
  }

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={ONE_PAGER_MESSAGES[state]} />}

      <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
        {state === "TODO" && <FileUpload accept={{ "application/pdf": [".pdf"] }} onUpload={handleUpload} />}

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
