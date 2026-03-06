import { OFFTAKER, OFFTAKER_LABELS } from "data/clients/pipedrive/constants.generated";
import { printFiat, printNumber, printPercent } from "logic/utils";

import { UserApplicationFormValues } from "./schema";

interface ViewApplicationProps {
  deal: Partial<UserApplicationFormValues>;
}

export function ViewApplication(props: ViewApplicationProps) {
  const { deal } = props;

  return (
    <div className="flex flex-col gap-6 px-1">
      {/* Hardware Section */}
      <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
        <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Hardware</h4>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">GPU Type</label>
          <span className="font-medium">{deal.gpuType ?? "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">GPUs per Server</label>
          <span className="font-medium">{deal.gpusPerServer ? printNumber(deal.gpusPerServer) : "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Number of Servers</label>
          <span className="font-medium">{deal.nbServers ? printNumber(deal.nbServers) : "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Server OEM</label>
          <span className="font-medium">{deal.serverOem ?? "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Ancillary Cost</label>
          <span className="font-medium">{deal.ancillaryCost ? printFiat(deal.ancillaryCost) : "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Unit Price</label>
          <span className="font-medium">{deal.unitPrice ? printFiat(deal.unitPrice) : "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">GPU Age</label>
          <span className="font-medium">{deal.gpuAge ?? "--"}</span>
        </div>
      </div>

      {/* Data Center Section */}
      <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
        <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Data Center</h4>
        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Data Center Operator</label>
          <span className="font-medium">{deal.dataCenterOperator ?? "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Data Center Address</label>
          <span className="font-medium">{deal.dataCenterAddress ?? "--"}</span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Location</label>
          <span className="font-medium">
            {deal.dataCenterCountry === "United States" && deal.dataCenterState
              ? `${deal.dataCenterState}, ${deal.dataCenterCountry}`
              : (deal.dataCenterCountry ?? "--")}
          </span>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
          <label className="text-sm font-light text-text-secondary">Data Center Tier</label>
          <span className="font-medium">{deal.dataCenterTier ?? "--"}</span>
        </div>
      </div>

      {/* Offtaker Section */}
      {deal.offtakerType !== undefined && deal.offtakerType !== OFFTAKER["No offtake"] && (
        <div className="shadow-base bg-white p-6.5 flex flex-col gap-4">
          <h4 className="text-xl font-normal whitespace-nowrap text-text-primary">Offtaker</h4>
          <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
            <label className="text-sm font-light text-text-secondary">Offtaker Type</label>
            <span className="font-medium">{OFFTAKER_LABELS[deal.offtakerType] ?? "--"}</span>
          </div>

          <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
            <label className="text-sm font-light text-text-secondary">Name of Offtaker</label>
            <span className="font-medium">{deal.offtakerName ?? "--"}</span>
          </div>

          <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
            <label className="text-sm font-light text-text-secondary">Length of Contract</label>
            <span className="font-medium">{`${deal.lengthOfContract ?? "--"} Months`}</span>
          </div>

          <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
            <label className="text-sm font-light text-text-secondary">Contract Rate (per hour per GPU)</label>
            <span className="font-medium">{deal.contractRate ? printFiat(deal.contractRate) : "--"}</span>
          </div>

          {deal.hasUpfrontDeposit === "yes" && (
            <div className="flex items-center gap-2.5 md:gap-4.5 [&>*]:w-1/2">
              <label className="text-sm font-light text-text-secondary">Up Front Deposit Rate</label>
              <span className="font-medium">
                {deal.upfrontDepositPercent ? printPercent(deal.upfrontDepositPercent / 100) : "--"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
