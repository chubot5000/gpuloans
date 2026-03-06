"use client";

import { getIdentityToken } from "@privy-io/react-auth";
import { backendClient } from "data/clients/backend";
import type { StepId, TaskId } from "logic/pages/ApplicationPage/core";

export type TaskStatus = "TODO" | "PENDING" | "COMPLETED" | "UNAVAILABLE";

/**
 * Updates the status of a task in the backend.
 *
 * @param applicationId - The application ID
 * @param stepId - The step ID that contains the task
 * @param taskId - The task ID to update
 * @param status - The new status for the task
 */
export async function updateTaskStatus(
  applicationId: number,
  stepId: StepId,
  taskId: TaskId,
  status: TaskStatus | null,
): Promise<void> {
  await backendClient.PATCH("/borrow/application/task/status", {
    body: {
      application_id: applicationId,
      step_id: stepId,
      task_id: taskId,
      status,
    },
    headers: {
      "privy-id-token": (await getIdentityToken()) ?? "",
    },
  });
}
