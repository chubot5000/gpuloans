"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { STAGES } from "data/clients/pipedrive/constants.generated";
import {
  DealDetail,
  getDealDetail,
  getApplicationStatuses,
  getDealCallStatus,
  getParticipants,
  type Participant,
} from "data/fetchers";
import { useSearchParamsMutation, useAccountDeals, useUpdateTaskStatus } from "logic/hooks";
import { isAtOrPastStage } from "logic/utils";
import { useParams } from "next/navigation";
import { type ReactNode, useContext, createContext, useMemo, useCallback } from "react";

import { computeAllSteps, type StepContext, type StepsResult } from "./core";
import { StepId } from "./core/constants";

type DealCallStatusData = Awaited<ReturnType<typeof getDealCallStatus>>;

interface ApplicationPageProviderCache {
  dealDetail: DealDetail;
  callStatus: DealCallStatusData | null;
  participants: Participant[];
}

function useApplicationState(cache: ApplicationPageProviderCache) {
  const params = useParams();
  const searchParams = useSearchParamsMutation();

  const dealId = Number(params.dealId);
  const step = searchParams.get("step") as StepId | null;

  const { data, isLoading: isLoadingDealDetail } = useQuery({
    queryKey: ["deal-detail", dealId, cache.dealDetail],
    queryFn: () => getDealDetail(dealId),
    enabled: Boolean(dealId),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 5, // 5 seconds
    initialData: cache.dealDetail,
  });

  const { activeDeals, isLoading: isLoadingDeals } = useAccountDeals();

  const { data: callStatusData } = useQuery({
    queryKey: ["deal-call-status", dealId],
    queryFn: () => getDealCallStatus(dealId),
    enabled: Boolean(dealId),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    initialData: cache.callStatus ?? undefined,
  });

  const { data: backendStatuses } = useQuery({
    queryKey: ["application-statuses", dealId],
    queryFn: () => getApplicationStatuses(dealId),
    enabled: Boolean(dealId),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 5, // 5 seconds
  });

  const { data: participants = [], isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["application-participants", dealId],
    queryFn: () => getParticipants(dealId),
    enabled: Boolean(dealId),
    refetchOnWindowFocus: false,
    initialData: cache.participants,
  });

  const queryClient = useQueryClient();
  const refetchParticipants = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["application-participants", dealId] });
  }, [queryClient, dealId]);

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const stage = data ? data.stage_id : cache.dealDetail.stage_id;

  const rawCallStatus = callStatusData?.metadata?.call_status;
  const callStatus = isAtOrPastStage(stage, STAGES.INTRO_CALL_HELD) ? ("completed" as const) : rawCallStatus;

  const { bySlug, stepsProgress, taskProgress, task } = useMemo(() => {
    const dealDetail = data ?? cache.dealDetail;
    const ctx: StepContext = { stage, dealDetail, callStatus, backendOverrides: backendStatuses };
    return computeAllSteps(ctx);
  }, [stage, data, cache.dealDetail, callStatus, backendStatuses]);

  const getSteps = (slug: StepId): StepsResult => bySlug[slug];

  const dealDetail = data ?? cache.dealDetail;

  return {
    activeDeals,
    firstName: dealDetail.firstName ?? null,
    lastName: dealDetail.lastName ?? null,
    dealDetail,
    isLoading: isLoadingDealDetail || isLoadingDeals,
    step,
    dealId,
    stage,
    callStatus,
    backendOverrides: backendStatuses,
    getSteps,
    stepsProgress,
    taskProgress,
    task,
    updateTaskStatus: updateTaskStatusMutation,
    participants,
    isLoadingParticipants,
    refetchParticipants,
  };
}

type ApplicationState = ReturnType<typeof useApplicationState>;

const ApplicationContext = createContext<ApplicationState | undefined>(undefined);

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error("useApplication must be used within ApplicationPageProvider");
  return context;
}

interface ApplicationPageProviderProps {
  children: ReactNode;
  cache: ApplicationPageProviderCache;
}

export function ApplicationPageProvider(props: ApplicationPageProviderProps) {
  const { children, cache } = props;
  const state = useApplicationState(cache);

  return <ApplicationContext.Provider value={state}>{children}</ApplicationContext.Provider>;
}
