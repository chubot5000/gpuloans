"use client";

import type { StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { Ty } from "ui/components";

import { FillApplication } from "./FillApplication";
import { fromDealDetail } from "./schema";
import { ViewApplication } from "./ViewApplication";

interface UserApplicationProps {
  state: StepState;
}

export function UserApplication(props: UserApplicationProps) {
  const { state } = props;
  const { dealDetail } = useApplication();

  const initialValues = fromDealDetail(dealDetail);

  if ((state === "TODO" || state === "PENDING") && dealDetail) {
    return <FillApplication dealId={dealDetail.id} initialValues={initialValues} />;
  }

  if (state === "COMPLETED" && initialValues) {
    return <ViewApplication deal={initialValues} />;
  }

  return <Ty className="text-text-secondary" value="This step is not yet available." />;
}
