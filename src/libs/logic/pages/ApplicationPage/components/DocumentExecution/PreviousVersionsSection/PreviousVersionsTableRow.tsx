"use client";

import type { PipedriveFile } from "data/fetchers";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";

import { PreviousVersionsRowTemplate } from "./PreviousVersionsTable";

interface PreviousVersionsTableRowProps {
  file: PipedriveFile;
}

export function PreviousVersionsTableRow({ file }: PreviousVersionsTableRowProps) {
  const owner = file.owner === "user" ? "User" : "GPULoans";
  return (
    <PreviousVersionsRowTemplate
      className="border-b border-outline-minor last:border-b-0"
    >
      <span title={file.name || file.file_name}>
        {trimFileName(file.name || file.file_name || "")}
      </span>
      <span className="text-sm text-text-dark-secondary text-center">{owner}</span>
      <span className="text-sm text-text-dark-secondary whitespace-nowrap text-center">{formatDate(file.add_time)}</span>
      <div className="flex w-full items-center justify-center gap-2 text-sm text-fill-primary">
        <Link
          href={file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-primary transition-colors flex-1 text-right"
        >
          View
        </Link>
        <span className="text-outline-major">|</span>
        <a
          href={`${file.downloadUrl}&filename=${encodeURIComponent(file.name)}`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-primary transition-colors flex items-center gap-1 flex-1"
        >
          <DownloadIcon className="size-3" />
          Download
        </a>
      </div>
    </PreviousVersionsRowTemplate>
  );
}

function trimFileName(fileName: string, maxLength: number = 30): string {
  if (fileName.length <= maxLength) return fileName;

  const extensionMatch = fileName.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[0] : "";
  const nameWithoutExt = fileName.slice(0, fileName.length - extension.length);

  if (nameWithoutExt.length <= maxLength - extension.length) return fileName;

  const startLength = Math.floor((maxLength - extension.length - 3) / 2);
  const endLength = Math.ceil((maxLength - extension.length - 3) / 2);

  const start = nameWithoutExt.slice(0, startLength);
  const end = nameWithoutExt.slice(-endLength);

  return `${start}...${end}${extension}`;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replaceAll(" ", "-");
  } catch {
    return "—";
  }
}
