import type { PipedriveFile } from "data/fetchers";
import { cn } from "logic/utils";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";

interface FileListProps {
  files: PipedriveFile[] | undefined;
  showEmptyState?: boolean;
}

export function FileList(props: FileListProps) {
  const { files, showEmptyState = false } = props;

  const isEmpty = !files || files.length === 0;

  if (isEmpty && showEmptyState) return <span className="text-sm text-text-secondary">No files were uploaded</span>;

  if (isEmpty) return null;

  return (
    <div
      className={cn(
        "flex flex-col px-6 py-4 gap-4 border border-outline-minor divide-y divide-outline-minor",
        "[&>div:last-child]:pb-0 [&>div]:pb-4",
      )}
    >
      {files.map((file) => (
        <div className="flex gap-3 items-center" key={file.id}>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm truncate text-text-primary">{file.name}</span>
          </div>
          <Link
            href={file.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center rounded-md transition-colors shrink-0 text-text-secondary hover:bg-background-tertiary hover:text-text-primary"
            aria-label={`View ${file.name}`}
          >
            View
          </Link>
          <span className="text-outline-major">|</span>
          <a
            href={`${file.downloadUrl}&filename=${encodeURIComponent(file.name)}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center transition-colors text-text-secondary hover:text-text-primary"
          >
            <DownloadIcon className="size-3" />
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
