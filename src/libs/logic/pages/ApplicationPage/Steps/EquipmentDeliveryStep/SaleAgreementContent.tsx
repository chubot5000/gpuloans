"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SALEANDCONTRIBUTIONAGREEMENT_STATUS } from "data/clients/pipedrive/constants.generated";
import { CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { useAdmin, type StepState } from "logic/components";
import { useApplication } from "logic/pages";

import { DocumentExecution, LockedStep } from "../../components";
import { DocumentId, TaskId } from "../../core/constants";
import { TEMPLATES_DOCS } from "../template_docs";

const STATE_MESSAGES = {
  TODO: "Upload your executed Sale & Contribution Agreement.",
  PENDING: "Your Sale & Contribution Agreement is being reviewed.",
  UNAVAILABLE: "This step is currently unavailable.",
  UW_COMMENTS: "The underwriter has provided comments on your document. Please review their feedback and re-upload.",
  REJECTED: "Your document was not approved. Please review the requirements and submit a revised document.",
  COMPLETED: "Your Sale & Contribution Agreement has been approved.",
};

interface SaleAgreementContentProps {
  state: StepState;
}

export function SaleAgreementContent({ state }: SaleAgreementContentProps) {
  const { dealId, dealDetail } = useApplication();
  const { isAdminMode } = useAdmin();

  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.SALE_AND_CONTRIBUTION],
    queryFn: () => getTaskFile(dealId, DocumentId.SALE_AND_CONTRIBUTION),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
    refetchInterval: 5 * 1000,
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_STATUS,
      statusOptionId: SALEANDCONTRIBUTIONAGREEMENT_STATUS["Under Review"],
      documentId: DocumentId.SALE_AND_CONTRIBUTION,
      description: `${DocumentId.SALE_AND_CONTRIBUTION}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.SALE_AND_CONTRIBUTION] });
  }

  const viewAndSignUrl = dealDetail.custom_fields?.saleAndContributionAgreementOverride ?? null;
  const downloadUrl = (files?.[0]?.downloadUrl ?? TEMPLATES_DOCS[TaskId.SALE_AGREEMENT]?.docURLs[0]) || null;

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <DocumentExecution
      taskId={TaskId.SALE_AGREEMENT}
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
