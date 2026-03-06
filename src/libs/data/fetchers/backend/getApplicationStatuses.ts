import { backendClient } from "data/clients/backend";
import type { StepState } from "logic/components";
import type { TaskId } from "logic/pages/ApplicationPage/core/constants";
import { z } from "zod";

const taskStatusSchema = z.enum(["PENDING", "TODO", "COMPLETED", "UNAVAILABLE", "REJECTED"]).nullable();

const taskSchema = z.object({
  id: z.string(),
  status: taskStatusSchema,
});

const stepSchema = z.object({
  id: z.string(),
  tasks: z.array(taskSchema),
});

const applicationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  Step: z.array(stepSchema),
});

const responseSchema = z.array(applicationSchema);

/**
 * Fetches application task statuses from the backend.
 *
 * @param id - The application ID to fetch task statuses for
 * @returns A promise that resolves to a record of task status overrides
 */
export async function getApplicationStatuses(id: number) {
  const response = await backendClient.GET("/borrow/application/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  const applications = responseSchema.parse(response.data);

  const application = applications[0];

  if (!application) return {};

  const taskStatusMap: Partial<Record<TaskId, StepState | null>> = {};

  for (const step of application.Step) {
    for (const task of step.tasks) {
      taskStatusMap[task.id as TaskId] = task.status as StepState | null;
    }
  }

  return taskStatusMap;
}
