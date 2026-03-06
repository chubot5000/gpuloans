"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, SPV_ONE_STOP, SPVONESTOP_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { useAdmin, type StepState } from "logic/components";
import { useApplication } from "logic/pages";

import { DocumentExecution, LockedStep } from "../../components";
import { DocumentId, TaskId } from "../../core/constants";
import { TEMPLATES_DOCS } from "../template_docs";

import { SelfManagedSPV } from "./SelfManagedSPV";

const STATE_MESSAGES: Record<StepState, string> = {
  TODO: "Review and sign the SPV LLC Formation Documents.",
  UNAVAILABLE: "This step is currently unavailable.",
  PENDING: "SPV LLC Documents are being reviewed.",
  COMPLETED: "SPV LLC Documents have been executed.",
  UW_COMMENTS:
    "GPULoans has provided comments on the SPV LLC Documents. Please review their feedback and make the necessary updates.",
  REJECTED: "SPV LLC Documents were not approved.",
};

interface ExecutedSPVProps {
  state: StepState;
}

export function ExecutedSPV(props: ExecutedSPVProps) {
  const { state } = props;
  const { dealId, dealDetail } = useApplication();
  const { isAdminMode } = useAdmin();
  const queryClient = useQueryClient();

  const spvOneStop = dealDetail.custom_fields?.spvOneStop;
  const isGPULoans = spvOneStop === SPV_ONE_STOP.GPULoans;

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.LLC_AGREEMENT],
    queryFn: () => getTaskFile(dealId, DocumentId.LLC_AGREEMENT),
    enabled: state !== "UNAVAILABLE",
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.SPVONESTOP_STATUS,
      statusOptionId: SPVONESTOP_STATUS["Under Review"],
      documentId: DocumentId.LLC_AGREEMENT,
      description: `${DocumentId.LLC_AGREEMENT}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.LLC_AGREEMENT] });
  }

  const viewAndSignUrl = dealDetail.custom_fields?.spvOneStopOverride ?? null;
  const downloadUrl =
    (files?.[0]?.downloadUrl ?? TEMPLATES_DOCS[TaskId.EXECUTED_SPV_LLC_DOCUMENTS]?.docURLs[0]) || null;

  if (state === "UNAVAILABLE") return <LockedStep />;

  if (isGPULoans) {
    return (
      <DocumentExecution
        taskId={TaskId.EXECUTED_SPV_LLC_DOCUMENTS}
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

  return <SelfManagedSPV state={state} files={files} isLoading={isLoading} />;
}
