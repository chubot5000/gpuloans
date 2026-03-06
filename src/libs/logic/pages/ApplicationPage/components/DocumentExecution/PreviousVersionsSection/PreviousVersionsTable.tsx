"use client";

import { PipedriveFile } from "data/fetchers";
import { cn, type PolymorphProps } from "logic/utils";
import { type ElementType, type ReactNode } from "react";
import { BaseRowTemplate, TableWrapper } from "ui/components";

import { PreviousVersionsTableRow } from "./PreviousVersionsTableRow";

interface PreviousVersionsTableProps {
  files: PipedriveFile[];
}

export function PreviousVersionsTable({ files }: PreviousVersionsTableProps) {
  if (files.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-text-secondary">No previous versions</div>
    );
  }



  return (
    <TableWrapper className="border border-outline-minor">
      <PreviousVersionsTableHeader />
      {files.map((file) => (
        <PreviousVersionsTableRow key={file.id} file={file} />
      ))}
    </TableWrapper>
  );
}

type PreviousVersionsRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

export function PreviousVersionsRowTemplate(props: PreviousVersionsRowTemplateProps<ElementType>) {
  const { className, children, ...rest } = props;

  return (
    <BaseRowTemplate
      {...rest}
      className={cn("flex shrink-0 gap-2 px-4 py-3 *:flex *:items-center", className)}
    >
      <div className="flex-[3] min-w-0 text-left">{children[0]}</div>
      <div className="flex-[1.5] min-w-0 justify-center">{children[1]}</div>
      <div className="flex-[1.5] min-w-0 justify-center">{children[2]}</div>
      <div className="flex-[2] min-w-0 justify-center">{children[3]}</div>
    </BaseRowTemplate>
  );
}

function PreviousVersionsTableHeader() {
  return (
    <PreviousVersionsRowTemplate className="border-b h-10 border-outline-minor text-text-dark-secondary">
      <span className="text-left">File Name</span>
      <span className="text-center">Uploaded By</span>
      <span className="text-center">Date</span>
      <span className="text-center">Actions</span>
    </PreviousVersionsRowTemplate>
  );
}

