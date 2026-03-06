"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  CUSTOM_FIELD_KEYS,
  JURISDICTION_REVIEW,
  OFFTAKER,
  OFFTAKER_OPTIONS,
} from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import { Button, Input, Select } from "ui/components";

import {
  CHIP_SERVER_TYPE_OPTIONS,
  DATA_CENTER_TIER_OPTIONS,
  getCountries,
  getUSStates,
  GPU_AGE_OPTIONS,
  GPUS_PER_SERVER_BY_CHIP,
  OEM_OPTIONS,
  YES_NO_OPTIONS,
} from "./data";
import { defaultFormValues, toPipedrivePayload, userApplicationSchema, type UserApplicationFormValues } from "./schema";

interface FillApplicationProps {
  dealId: number;
  initialValues?: Partial<UserApplicationFormValues>;
}

export function FillApplication(props: FillApplicationProps) {
  const { dealId, initialValues } = props;
  const queryClient = useQueryClient();

  const COUNTRIES = getCountries();
  const US_STATES = getUSStates();

  const form = useForm({
    defaultValues: { ...defaultFormValues, ...initialValues },
    onSubmit: async ({ value }) => {
      const payload = toPipedrivePayload(value);
      await patchDeal(dealId, payload);

      if (value.dataCenterCountry !== "United States")
        await patchDeal(dealId, {
          custom_fields: { [CUSTOM_FIELD_KEYS.JURISDICTION_REVIEW]: JURISDICTION_REVIEW["Under Review"] },
        });
      else
        await patchDeal(dealId, {
          custom_fields: { [CUSTOM_FIELD_KEYS.JURISDICTION_REVIEW]: JURISDICTION_REVIEW["Approved"] },
        });

      await queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    },
    validators: { onChange: userApplicationSchema },
  });

  const { Field, Subscribe } = form;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6 px-1"
    >
      {/* Hardware Section */}
      <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
        <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Hardware</h4>
        <Field name="gpuType">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">GPU Type</label>
              <Select
                value={field.state.value ?? ""}
                onChange={(value) => {
                  field.handleChange(value);
                  const defaultGpuCount = GPUS_PER_SERVER_BY_CHIP[value];
                  if (defaultGpuCount) form.setFieldValue("gpusPerServer", defaultGpuCount);
                }}
                options={CHIP_SERVER_TYPE_OPTIONS}
                placeholder="Select type"
              />
            </div>
          )}
        </Field>

        <Field name="gpusPerServer">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">GPUs per Server</label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ? field.state.value.toString() : ""}
                onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                onBlur={field.handleBlur}
                placeholder="8"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                disabled={true}
              />
            </div>
          )}
        </Field>

        <Field name="nbServers">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Number of Servers</label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                maxDecimals={2}
                value={field.state.value ? field.state.value.toString() : ""}
                onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                onBlur={field.handleBlur}
                placeholder="42"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
              />
            </div>
          )}
        </Field>

        <Field name="serverOem">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Server OEM</label>
              <Select
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                options={OEM_OPTIONS}
                placeholder="Select OEM"
              />
            </div>
          )}
        </Field>

        <Field name="gpuAge">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">GPU Age</label>
              <Select
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                options={GPU_AGE_OPTIONS}
                placeholder="Select age"
              />
            </div>
          )}
        </Field>

        <Field name="unitPrice">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Unit Price</label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                maxDecimals={2}
                value={field.state.value ? field.state.value.toString() : ""}
                onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                onBlur={field.handleBlur}
                placeholder="25,000"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                leading={<span className="pr-2 text-text-secondary">$</span>}
              />
            </div>
          )}
        </Field>

        <Field name="ancillaryCost">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Ancillary Cost</label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                maxDecimals={2}
                value={field.state.value ? field.state.value.toString() : ""}
                onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                onBlur={field.handleBlur}
                placeholder="0"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                leading={<span className="pr-2 text-text-secondary">$</span>}
              />
            </div>
          )}
        </Field>
      </div>

      {/* Data Center Section */}
      <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
        <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Data Center</h4>
        <Field name="dataCenterOperator">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Data Center Operator</label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Equinix, Digital Realty"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
              />
            </div>
          )}
        </Field>

        <Field name="dataCenterAddress">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Data Center Address</label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                placeholder="Enter full address"
                className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
              />
            </div>
          )}
        </Field>

        <Field name="dataCenterCountry">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Country</label>
              <Select
                value={field.state.value ?? ""}
                onChange={(value) => {
                  field.handleChange(value);
                  if (value !== "United States") form.setFieldValue("dataCenterState", "");
                }}
                options={COUNTRIES}
                searchable
                placeholder="Select country"
              />
            </div>
          )}
        </Field>

        <Subscribe selector={(state) => state.values.dataCenterCountry}>
          {(country) =>
            country === "United States" && (
              <Field name="dataCenterState">
                {(field) => (
                  <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                    <label className="text-sm font-light text-text-secondary">State</label>
                    <Select
                      value={field.state.value ?? ""}
                      onChange={(value) => field.handleChange(value)}
                      options={US_STATES}
                      searchable
                      placeholder="Select state"
                    />
                  </div>
                )}
              </Field>
            )
          }
        </Subscribe>

        <Field name="dataCenterTier">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Data Center Tier</label>
              <Select
                value={field.state.value ?? ""}
                onChange={(value) => field.handleChange(value)}
                options={DATA_CENTER_TIER_OPTIONS}
                placeholder="Select tier"
              />
            </div>
          )}
        </Field>
      </div>

      {/* Offtaker Section */}
      <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
        <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Offtaker</h4>
        <Field name="offtakerType">
          {(field) => (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Offtaker</label>
              <Select
                value={field.state.value?.toString() ?? ""}
                onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                options={OFFTAKER_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value.toString() }))}
                placeholder="Select"
              />
            </div>
          )}
        </Field>

        <Subscribe selector={(state) => state.values.offtakerType}>
          {(offtakerType) =>
            offtakerType !== undefined &&
            offtakerType !== OFFTAKER["No offtake"] && (
              <>
                <Field name="offtakerName">
                  {(field) => (
                    <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                      <label className="text-sm font-light text-text-secondary">Name of Offtaker</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter offtaker name"
                        className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                        inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                      />
                    </div>
                  )}
                </Field>

                <Field name="lengthOfContract">
                  {(field) => (
                    <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                      <label className="text-sm font-light text-text-secondary">Length of Contract</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        placeholder="36"
                        className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                        inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                        trailing={<span className="pl-2 text-text-secondary">Months</span>}
                      />
                    </div>
                  )}
                </Field>

                <Field name="contractRate">
                  {(field) => (
                    <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                      <label className="text-sm font-light text-text-secondary">Contract Rate (per hour per GPU)</label>
                      <Input
                        id={field.name}
                        type="number"
                        maxDecimals={2}
                        name={field.name}
                        value={field.state.value ? field.state.value.toString() : ""}
                        onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                        onBlur={field.handleBlur}
                        placeholder="3"
                        className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                        inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                        leading={<span className="pr-2 text-text-secondary">$</span>}
                      />
                    </div>
                  )}
                </Field>

                <Field name="hasUpfrontDeposit">
                  {(field) => (
                    <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                      <label className="text-sm font-light text-text-secondary">Up Front Deposit</label>
                      <Select
                        value={field.state.value ?? ""}
                        onChange={(value) => field.handleChange(value as "yes" | "no")}
                        options={YES_NO_OPTIONS}
                        placeholder="Select"
                      />
                    </div>
                  )}
                </Field>

                <Subscribe selector={(state) => state.values.hasUpfrontDeposit}>
                  {(hasUpfrontDeposit) =>
                    hasUpfrontDeposit === "yes" && (
                      <Field name="upfrontDepositPercent">
                        {(field) => (
                          <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
                            <label className="text-sm font-light text-text-secondary">Up Front Deposit Rate</label>
                            <Input
                              type="number"
                              id={field.name}
                              name={field.name}
                              value={field.state.value != null ? String(field.state.value) : ""}
                              onChange={(value) => field.handleChange(value ? Number(value) : undefined)}
                              onBlur={field.handleBlur}
                              placeholder="10"
                              className="border-0 border-b border-outline-major bg-bg-primary px-4 py-1.5 text-primary"
                              inputClassName="bg-bg-primary p-0 font-normal placeholder:opacity-60 h-full"
                              trailing={<span className="pl-2 text-text-secondary">%</span>}
                              maxDecimals={2}
                              maxLength={3}
                            />
                          </div>
                        )}
                      </Field>
                    )
                  }
                </Subscribe>
              </>
            )
          }
        </Subscribe>
      </div>

      <Subscribe selector={(state) => [!state.isPristine && state.canSubmit, state.isSubmitting, state.isValidating]}>
        {([canSubmit, isSubmitting, isValidating]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            isLoading={isSubmitting || isValidating}
            className="self-start py-3 w-full max-w-xs md:w-54 btn-primary"
          >
            Submit
          </Button>
        )}
      </Subscribe>
    </form>
  );
}
