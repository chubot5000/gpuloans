"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ApplicationsLogin, useAdmin } from "logic/components";
import { printFiat } from "logic/utils";
import { Msg } from "ui/components";

import { useApplication } from "./ApplicationPageProvider";
import { ApplicationSelector } from "./ApplicationSelector";
import { ApplicationStepView } from "./ApplicationStepView";
import {
  MetricsCard,
  ApplicationRow,
  ProgressCard,
  ActionItems,
  CalendlyInfoModal,
  ViewDocumentsButton,
  DealOptionsMenu,
} from "./components";
import { STEPS } from "./core/constants";

export function ApplicationPage() {
  const { ready, user } = usePrivy();
  const { step } = useApplication();
  const { isAdminMode } = useAdmin();

  if (!ready) return <Msg className="m-auto">Loading...</Msg>;

  if (!user || !user.email)
    return (
      <div className="flex flex-col justify-start items-center mt-16 -mb-16 h-main">
        <ApplicationsLogin className="items-center" />
      </div>
    );

  return (
    <>
      {!isAdminMode && <CalendlyInfoModal />}
      {step ? <ApplicationStepView stepSlug={step} /> : <ApplicationPage_ />}
    </>
  );
}

function ApplicationPage_() {
  const { isAdminMode } = useAdmin();
  const { activeDeals, dealId, dealDetail, firstName, stepsProgress } = useApplication();
  const {
    custom_fields: { ltv, apr, gpuType, nbServers, location },
    loanAmount,
  } = dealDetail;

  if (!dealDetail || !activeDeals) return null;

  return (
    <>
      <div className="flex flex-col min-[840px]:flex-row gap-4">
        <h2 className="text-2xl font-medium font-eiko md:text-3xl">Welcome back, {firstName}</h2>

        <div className="flex flex-1 items-center max-sm:flex-wrap justify-end gap-2 md:justify-between">
          {!isAdminMode && <ApplicationSelector className="flex justify-end" />}

          <div className="flex items-center gap-2 ml-auto">
            <ViewDocumentsButton className="w-fit" />
            <DealOptionsMenu />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-8">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-col gap-6 w-full md:flex-row lg:w-2/3">
            <MetricsCard
              className="w-full h-52"
              variant="dark"
              title="Loan Terms"
              metrics={[
                { label: "Principal", value: loanAmount?.value ? printFiat(loanAmount.value) : "Pending" },
                { label: "LTV", value: ltv ? `${ltv}%` : "Up to 80%" },
                { label: "APR", value: apr ? `${apr}%` : "As low as 7%" },
              ]}
            />
            <MetricsCard
              className="w-full h-52"
              variant="light"
              title="Asset Details"
              metrics={[
                { label: "GPU Type", value: gpuType ?? "--" },
                { label: "Servers", value: nbServers ?? "--" },
                { label: "Location", value: location ?? "--" },
              ]}
            />
          </div>
          <ProgressCard className="w-full bg-white lg:w-1/3 min-h-52" />
        </section>

        <ActionItems />

        <section className="flex flex-col gap-4">
          <h3 className="text-xl font-medium font-eiko">Application Progress</h3>
          <div className="flex flex-col bg-white border border-outline-minor">
            {STEPS.map((step, index) => (
              <ApplicationRow
                key={step.id}
                label={step.label}
                number={index + 1}
                stats={stepsProgress[step.id]}
                href={`/applications/${dealId}?step=${step.id}`}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
