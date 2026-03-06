import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskStatus, updateTaskStatus } from "data/fetchers";
import type { StepId, TaskId } from "logic/pages/ApplicationPage/core";

interface UpdateTaskStatusParams {
  applicationId: number;
  stepId: StepId;
  taskId: TaskId;
  status: TaskStatus | null;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, stepId, taskId, status }: UpdateTaskStatusParams) =>
      updateTaskStatus(applicationId, stepId, taskId, status),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["application-statuses", variables.applicationId],
      });
    },

    onError: (error) => {
      console.error("Failed to update task status:", error);
    },
  });
}
