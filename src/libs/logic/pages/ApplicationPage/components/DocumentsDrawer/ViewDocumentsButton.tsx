"use client";

import { cn } from "logic/utils";
import { FileTextIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "ui/components";

import { DocumentsDrawer } from "./DocumentsDrawer";

interface ViewDocumentsButtonProps {
  className?: string;
}

export function ViewDocumentsButton(props: ViewDocumentsButtonProps) {
  const { className } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn("h-9 text-sm font-normal tracking-[-0.14px] btn-primary-light gap-2.5", className)}
      >
        <FileTextIcon className="size-4" />
        View Documents
      </Button>

      <DocumentsDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
