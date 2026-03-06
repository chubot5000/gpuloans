"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, NDA_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { useAdmin, type StepState } from "logic/components";
import { useApplication } from "logic/pages";

import { DocumentExecution } from "../../../components";
import { DocumentId, TaskId } from "../../../core/constants";
import { TEMPLATES_DOCS } from "../../template_docs";

import { STATE_MESSAGES } from "./constants";

interface ExecuteNdaProps {
  state: StepState;
}

export function ExecuteNda(props: ExecuteNdaProps) {
  const { state } = props;
  const { dealId, dealDetail } = useApplication();
  const { isAdminMode } = useAdmin();

  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.NDA],
    queryFn: () => getTaskFile(dealId, DocumentId.NDA),
    enabled: state !== "UNAVAILABLE",
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.NDA_STATUS,
      statusOptionId: NDA_STATUS["Needs Review"],
      documentId: DocumentId.NDA,
      description: `${DocumentId.NDA}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.NDA] });
  }

  const viewAndSignUrl = dealDetail.custom_fields?.ndaOverride ?? null;
  const downloadUrl = (files?.[0]?.downloadUrl ?? TEMPLATES_DOCS[TaskId.NDA]?.docURLs[1]) || null;

  return (
    <DocumentExecution
      taskId={TaskId.NDA}
      state={state}
      viewAndSignUrl={viewAndSignUrl}
      downloadUrl={downloadUrl}
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      stateMessages={STATE_MESSAGES}
    />
  );
}
