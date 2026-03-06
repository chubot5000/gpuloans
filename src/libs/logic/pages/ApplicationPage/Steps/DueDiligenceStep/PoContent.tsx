"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BRIDGE_LOAN,
  CUSTOM_FIELD_KEYS,
  OEM_PAYMENT_TERMS,
  OEM_PAYMENT_TERMS_LABELS,
  PURCHASEORDER_STATUS,
} from "data/clients/pipedrive/constants.generated";
import { type DealDetail, getTaskFile, patchDeal, uploadPipedriveDealFile } from "data/fetchers";
import { type StepState } from "logic/components";
import { useApplication } from "logic/pages/ApplicationPage/ApplicationPageProvider";
import { FormField } from "logic/pages/ApplicationPage/components/FormField";
import { useState } from "react";
import { FileUpload, Select, Spinner, Ty } from "ui/components";

import { FileList, LockedStep } from "../../components";
import { DocumentId } from "../../core/constants";

import { NET30_OPTIONS, PO_MESSAGES } from "./constants";

interface PoContentProps {
  state: StepState;
}

export function PoContent({ state }: PoContentProps) {
  const {
    dealDetail: { custom_fields },
    dealId,
  } = useApplication();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const oemNet30Terms = custom_fields?.net30;

  const { data: files, isLoading } = useQuery({
    queryKey: ["deal-file", dealId, DocumentId.PURCHASE_ORDER],
    queryFn: () => getTaskFile(dealId, DocumentId.PURCHASE_ORDER),
    enabled: state !== "TODO" && state !== "UNAVAILABLE",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: number) => {
      const bridgeLoan = value === OEM_PAYMENT_TERMS.Net30 ? BRIDGE_LOAN.Yes : null;

      await patchDeal(dealId, {
        custom_fields: {
          [CUSTOM_FIELD_KEYS.BRIDGE_LOAN]: bridgeLoan,
          [CUSTOM_FIELD_KEYS.OEM_PAYMENT_TERMS]: value,
        },
      });
    },
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ["deal-detail", dealId] });

      const previousData = queryClient.getQueryData<DealDetail>(["deal-detail", dealId]);

      if (previousData) {
        queryClient.setQueryData<DealDetail>(["deal-detail", dealId], {
          ...previousData,
          custom_fields: {
            ...previousData.custom_fields,
            net30: newValue,
          },
        });
      }

      return { previousData };
    },
    onError: (error, _newValue, context) => {
      if (context?.previousData) queryClient.setQueryData(["deal-detail", dealId], context.previousData);
      console.error("Failed to update Net30 terms:", error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] }),
  });

  const handleSelectChange = (value: string) => {
    const numericValue = Number(value);

    if (!isNaN(numericValue)) mutate(numericValue);
  };

  async function handleFilesChange(files: File[]) {
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
            fieldKey: CUSTOM_FIELD_KEYS.PURCHASEORDER_STATUS,
            statusOptionId: PURCHASEORDER_STATUS["Under Review"],
            documentId: DocumentId.PURCHASE_ORDER,
          });
        }),
      );

      await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
      await queryClient.invalidateQueries({ queryKey: ["deal-file", dealId, DocumentId.PURCHASE_ORDER] });
    } catch (error) {
      console.error("Failed to upload files:", error);
    } finally {
      setIsUploading(false);
    }
  }

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      {state !== "COMPLETED" && <Ty className="text-text-secondary" value={PO_MESSAGES[state]} />}

      <div className="flex flex-col gap-4 p-4 md:p-8 shadow-base">
        <FormField label="Do you have Net30 Terms?" className="flex flex-row flex-wrap justify-between items-center">
          <Select
            value={oemNet30Terms ? OEM_PAYMENT_TERMS_LABELS[oemNet30Terms] : ""}
            onChange={handleSelectChange}
            options={NET30_OPTIONS}
            placeholder="Select option"
            className="w-full max-w-xs"
            disabled={isPending || state !== "TODO"}
          />
        </FormField>

        {state === "TODO" && (
          <FileUpload accept={{ "application/pdf": [".pdf"] }} onUpload={handleFilesChange} disabled={isUploading} />
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
