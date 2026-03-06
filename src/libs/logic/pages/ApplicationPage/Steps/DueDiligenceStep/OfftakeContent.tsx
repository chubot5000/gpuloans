"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OFFTAKE_AGREEMENT } from "data/clients/pipedrive/constants.generated";
import { CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { type StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { FileUpload, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { DocumentId } from "../../core/constants";

import { EXECUTED_OFFTAKE_MESSAGES } from "./constants";

interface ExecutedOfftakeContentProps {
  state: StepState;
}

export function ExecutedOfftakeContent({ state }: ExecutedOfftakeContentProps) {
  const { dealId } = useApplication();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.OFFTAKE_AGREEMENT],
    queryFn: () => getTaskFile(dealId, DocumentId.OFFTAKE_AGREEMENT),
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
          fieldKey: CUSTOM_FIELD_KEYS.OFFTAKE_AGREEMENT,
          statusOptionId: OFFTAKE_AGREEMENT["Under Review"],
          documentId: DocumentId.OFFTAKE_AGREEMENT,
        });
      }),
    );

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.OFFTAKE_AGREEMENT] });
  }

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={EXECUTED_OFFTAKE_MESSAGES[state]} />}

      <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
        {state === "TODO" && <FileUpload accept={{ "application/pdf": [".pdf"] }} onUpload={handleFilesChange} />}

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
