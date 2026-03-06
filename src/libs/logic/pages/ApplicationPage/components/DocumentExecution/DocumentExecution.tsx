"use client";

import type { PipedriveFile } from "data/fetchers";
import type { StepState } from "logic/components";

import type { TaskId } from "../../core";
import { FileList } from "../FileList";

import { DocumentHeader } from "./DocumentHeader";
import { FileUpload } from "./FileUpload";
import { PreviousVersionsSection } from "./PreviousVersionsSection";

interface DocumentExecutionProps {
  taskId: TaskId;
  state: StepState;
  viewAndSignUrl: string | null;
  downloadUrl: string | null;
  files: PipedriveFile[] | undefined;
  isLoading: boolean;
  onUpload: (uploades: File[]) => Promise<void>;
  stateMessages: Partial<Record<StepState, string>>;
}

export function DocumentExecution(props: DocumentExecutionProps) {
  const { taskId, state, viewAndSignUrl, downloadUrl, files, isLoading, onUpload, stateMessages } = props;

  const showUploadSection = state === "TODO" || state === "UW_COMMENTS";

  if (state === "COMPLETED") return <FileList files={files} />;

  return (
    <div className="flex flex-col gap-4">
      {!showUploadSection && <p className="text-sm text-text-secondary">{stateMessages[state]}</p>}

      <DocumentHeader taskId={taskId} viewAndSignUrl={viewAndSignUrl} downloadUrl={downloadUrl} />

      {state !== "TODO" && <PreviousVersionsSection files={files} isLoading={isLoading} />}

      {showUploadSection && (
        <>
          <p className="text-sm text-text-secondary">
            If you&apos;ve downloaded and redlined the document, please upload it below. We will review and respond.
          </p>
          <FileUpload onUpload={onUpload} />
        </>
      )}
    </div>
  );
}
