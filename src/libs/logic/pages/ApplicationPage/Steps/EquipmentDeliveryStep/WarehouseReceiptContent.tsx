import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, WAREHOUSERECEIPT_STATUS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, uploadPipedriveDealFile } from "data/fetchers";
import { StepState, useAdmin } from "logic/components";
import { useApplication } from "logic/pages";

import { DocumentExecution, LockedStep } from "../../components";
import { DocumentId, TaskId } from "../../core/constants";
import { TEMPLATES_DOCS } from "../template_docs";

const MESSAGES: Partial<Record<StepState, string>> = {
  PENDING: "The Warehouse Receipt is currently under review.",
  COMPLETED: "The Warehouse Receipt has been approved.",
  UW_COMMENTS:
    "The underwriter has provided comments on the Warehouse Receipt. Please review their feedback and make the necessary updates.",
  REJECTED: "The Warehouse Receipt was not approved.",
};

interface WarehouseReceiptContentProps {
  state: StepState;
}

export function WarehouseReceiptContent(props: WarehouseReceiptContentProps) {
  const { state } = props;
  const { dealId } = useApplication();
  const { isAdminMode } = useAdmin();

  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.WAREHOUSE_RECEIPT],
    queryFn: () => getTaskFile(dealId, DocumentId.WAREHOUSE_RECEIPT),
    enabled: state !== "UNAVAILABLE",
  });

  async function handleUpload(uploades: File[]) {
    const formData = new FormData();
    formData.append("file", uploades[0]);
    const version = (files?.length ?? 0) + 1;
    await uploadPipedriveDealFile({
      fileData: formData,
      dealId,
      fieldKey: CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_STATUS,
      statusOptionId: WAREHOUSERECEIPT_STATUS["Under Review"],
      documentId: DocumentId.WAREHOUSE_RECEIPT,
      description: `${DocumentId.WAREHOUSE_RECEIPT}_v${version}_${isAdminMode ? "admin" : "user"}`,
    });

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.WAREHOUSE_RECEIPT] });
  }

  const viewAndSignUrl = null;
  const downloadUrl = (files?.[0]?.downloadUrl ?? TEMPLATES_DOCS[TaskId.WAREHOUSE]?.docURLs[0]) || null;

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <DocumentExecution
      taskId={TaskId.WAREHOUSE}
      state={state}
      viewAndSignUrl={viewAndSignUrl}
      downloadUrl={downloadUrl}
      files={files}
      isLoading={isLoading}
      onUpload={handleUpload}
      stateMessages={MESSAGES}
    />
  );
}
