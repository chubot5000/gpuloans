"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, CUSTOMERSERVICEAGREEMENT_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { useAdmin, type StepState } from "logic/components";
import { useApplication } from "logic/pages";

import { DocumentExecution, LockedStep } from "../../components";
import { DocumentId, TaskId } from "../../core/constants";
import { TEMPLATES_DOCS } from "../template_docs";

const STATE_MESSAGES = {
  TODO: "Upload your executed Customer Service Agreement.",
  UNAVAILABLE: "This step is currently unavailable.",
  PENDING: "Customer Service Agreement is being reviewed.",
  COMPLETED: "Customer Service Agreement has been approved.",
  UW_COMMENTS:
    "GPULoans has provided comments on the Customer Service Agreement. Please review their feedback and make the necessary updates.",
  REJECTED: "Customer Service Agreement was not approved.",
};

interface CSAProps {
  state: StepState;
}

export function CSA(props: CSAProps) {
  const { state } = props;
  const { dealId, dealDetail } = useApplication();
  const { isAdminMode } = useAdmin();

  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.APPROVAL_RA_IM],
    queryFn: () => getTaskFile(dealId, DocumentId.APPROVAL_RA_IM),
    enabled: state !== "UNAVAILABLE",
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_STATUS,
      statusOptionId: CUSTOMERSERVICEAGREEMENT_STATUS["Under Review"],
      documentId: DocumentId.APPROVAL_RA_IM,
      description: `${DocumentId.APPROVAL_RA_IM}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.APPROVAL_RA_IM] });
  }

  const viewAndSignUrl = dealDetail.custom_fields?.customerServiceAgreementOverride ?? null;
  const downloadUrl = (files?.[0]?.downloadUrl ?? TEMPLATES_DOCS[TaskId.CSA]?.docURLs[0]) || null;

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <DocumentExecution
      taskId={TaskId.CSA}
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
