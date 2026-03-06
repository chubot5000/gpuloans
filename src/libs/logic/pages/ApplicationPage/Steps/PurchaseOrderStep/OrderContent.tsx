"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PROOF_OF_ORDER,
  SALEANDCONTRIBUTIONAGREEMENT_STATUS,
  SPV_IS_PO_PURCHASER,
  SPV_IS_PO_PURCHASER_LABELS,
  SPV_IS_PO_PURCHASER_OPTIONS,
} from "data/clients/pipedrive/constants.generated";
import { CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { getTaskFile, patchDeal, uploadPipedriveDealFile } from "data/fetchers";
import { type StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { FileUpload, Select, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { FormField } from "../../components/FormField";
import { DocumentId } from "../../core/constants";

const STATE_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Upload proof of your equipment order placement (Purchase Order or Bill of Materials).",
  PENDING: "Your proof of order placement is being reviewed.",
  UNAVAILABLE: "This step is currently unavailable.",
  UW_COMMENTS: "The underwriter has comments on your document. Please review and re-upload.",
  REJECTED: "Your document was rejected. Please upload a new document.",
};

interface OrderContentProps {
  state: StepState;
}

export function OrderContent({ state }: OrderContentProps) {
  const {
    dealDetail: { custom_fields },
    dealId,
  } = useApplication();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.PROOF_OF_ORDER],
    queryFn: () => getTaskFile(dealId, DocumentId.PROOF_OF_ORDER),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
  });

  const spvIsPoPurchaser = custom_fields?.spvIsPoPurchaser;

  const { mutate: updatePurchaser, isPending: isUpdatingPurchaser } = useMutation({
    mutationFn: async (value: number) => {
      await patchDeal(dealId, {
        custom_fields: {
          [CUSTOM_FIELD_KEYS.SPV_IS_PO_PURCHASER]: value,
          ...(value === SPV_IS_PO_PURCHASER.Yes && {
            [CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_STATUS]:
              SALEANDCONTRIBUTIONAGREEMENT_STATUS["Under Review"],
          }),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    },
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
          fieldKey: CUSTOM_FIELD_KEYS.PROOF_OF_ORDER,
          statusOptionId: PROOF_OF_ORDER["Under Review"],
          documentId: DocumentId.PROOF_OF_ORDER,
        });
      }),
    );

    await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.PROOF_OF_ORDER] });
  }

  const handleSelectChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) updatePurchaser(numericValue);
  };

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={STATE_MESSAGES[state]} />}

      <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
        <FormField
          label="Is the SPV the legal Purchaser on the Purchase Order?"
          className="flex flex-row flex-wrap justify-between items-center"
        >
          <Select
            value={spvIsPoPurchaser ? SPV_IS_PO_PURCHASER_LABELS[spvIsPoPurchaser] : ""}
            onChange={handleSelectChange}
            options={SPV_IS_PO_PURCHASER_OPTIONS.map((opt) => ({ label: opt.label, value: String(opt.value) }))}
            placeholder="Select option"
            className="w-full max-w-xs"
            disabled={isUpdatingPurchaser || state !== "TODO"}
          />
        </FormField>

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
