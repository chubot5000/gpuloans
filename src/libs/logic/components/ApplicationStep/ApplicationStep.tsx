"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { TaskStatus } from "data/fetchers";
import { useUpdateTaskStatus } from "logic/hooks";
import { useAdmin } from "logic/index";
import { useApplication } from "logic/pages/ApplicationPage/ApplicationPageProvider";
import { FormField } from "logic/pages/ApplicationPage/components";
import type { StepId, TaskId } from "logic/pages/ApplicationPage/core";
import { cn } from "logic/utils";
import { ChevronRightIcon, LockIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button, Drawer, Select, Ty } from "ui/components";

import { ApplicationStepIcons } from "./ApplicationStepIcon";

export type StepState = "TODO" | "PENDING" | "COMPLETED" | "UNAVAILABLE" | "UW_COMMENTS" | "REJECTED";

export type TaskType = "CALL" | "LINK" | "DOC" | "FORM" | "NETWORK" | "APP";

const ADMIN_STATUS_OPTIONS = [
  { value: "UNAVAILABLE", label: "Locked" },
  { value: "TODO", label: "To Do" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
];

interface ApplicationStepProps {
  state: StepState;
  type: TaskType;
  title: ReactNode;
  actionLabel: ReactNode;
  children: ReactNode;
  actionFn?: () => void;
  containerClassName?: string;
  buttonClassName?: string;
  panelClassName?: string;
  taskId?: TaskId;
  stepId?: StepId;
}

export function ApplicationStep(props: ApplicationStepProps) {
  const {
    state,
    type,
    title,
    actionLabel,
    children,
    actionFn,
    containerClassName,
    buttonClassName,
    panelClassName,
    taskId,
    stepId,
  } = props;

  const { isAdminMode } = useAdmin();
  const { dealId } = useApplication();
  const [selectedStatus, setSelectedStatus] = useState<StepState>(state);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { isError, error, isPending, mutate } = useUpdateTaskStatus();

  const handleUpdateStatus = () => {
    if (taskId && stepId && selectedStatus !== state) {
      mutate({
        applicationId: dealId,
        stepId,
        taskId,
        status: selectedStatus as TaskStatus, // TODO: remove this cast when BE accepts ApplicationStepState
      });
    }
  };

  const containerStateClasses: Record<StepState, string> = {
    COMPLETED: "state-completed-container",
    PENDING: "state-pending-container",
    UW_COMMENTS: "state-pending-container",
    TODO: "state-todo-container",
    UNAVAILABLE: "state-unavailable-container",
    REJECTED: "state-rejected-container",
  };

  return (
    <>
      <div
        className={cn(
          "w-full bg-bg-page shadow-base border border-transparent cursor-pointer hover:border-outline-major py-3 px-4 md:py-4 md:px-6 group",
          { [containerStateClasses[state]]: true },
          containerClassName,
        )}
      >
        <div
          className={cn("w-full flex gap-2 items-center group justify-between", buttonClassName)}
          onClick={() => {
            if (!actionFn) setIsDrawerOpen(true);
          }}
        >
          <div className="flex gap-2 items-center">
            <ApplicationStepIcons className="state-item" type={type} />
            <Ty className="text-sm text-left" value={title} />
          </div>

          <div className="flex gap-6 items-center">
            <button
              type="button"
              className="px-2.5 flex items-center justify-center py-1.5 w-32 rounded state-item shrink-0 gap-1"
              onClick={(e) => {
                e.stopPropagation();
                if (actionFn) actionFn();
                else setIsDrawerOpen(true);
              }}
            >
              {state === "UNAVAILABLE" ? <LockIcon className="size-4" /> : null}
              <Ty value={actionLabel} />
            </button>
            <ChevronRightIcon className="shrink-0 size-6 text-fill-primary" />
          </div>
        </div>
      </div>

      <Drawer
        showCloseButton={false}
        onClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
        className={cn(
          "w-full max-w-4xl relative flex flex-col md:flex-row items-stretch !p-0 !overflow-hidden bg-bg-page",
          panelClassName,
          containerStateClasses[state],
        )}
      >
        <div className="flex overflow-hidden flex-col flex-1">
          <div className="overflow-y-auto flex-1 p-4 sm:p-12 sm:pb-8">
            <Drawer.Title className="flex gap-2 items-center">
              <ApplicationStepIcons className="state-item-base" type={type} />
              <Ty value={title} />
              <div className="px-2.5 ml-2 min-w-23 flex items-center justify-center py-1.5 rounded state-item-base shrink-0 gap-1">
                <Ty className="text-sm font-normal font-swiss" value={actionLabel} />
              </div>
              <div className="flex-grow"></div>
              <button className="p-2" onClick={() => setIsDrawerOpen(false)}>
                <XMarkIcon className="stroke-2 size-6 text-primary" />
              </button>
            </Drawer.Title>
            <Drawer.Children className="px-2 !pt-0 !overflow-visible">{children}</Drawer.Children>
          </div>
          {isAdminMode && (
            <div className="flex flex-col gap-4 p-4 pb-4 bg-white border-t sm:p-12 sm:pb-12 border-outline-minor shrink-0">
              <div className="flex flex-col flex-1 gap-4">
                <span className="text-xs font-medium uppercase text-text-primary">Admin Controls</span>
                <div className="space-y-4">
                  <FormField label="Status">
                    <Select
                      value={selectedStatus}
                      onChange={(value) => setSelectedStatus(value as StepState)}
                      options={ADMIN_STATUS_OPTIONS}
                      className="w-full bg-white"
                      triggerClassName="w-full bg-white"
                    />
                  </FormField>
                  {isError && <span className="text-xs text-red-500">{error.message}</span>}
                </div>

                <Button
                  className="mt-auto"
                  onClick={handleUpdateStatus}
                  isLoading={isPending}
                  disabled={selectedStatus === state || isPending}
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
