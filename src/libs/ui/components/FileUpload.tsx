"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "logic/utils";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";

import { Button } from "./Button";
import { Spinner } from "./Spinner";

export interface FileUploadProps {
  onUpload?: (files: File[]) => Promise<void> | void;
  accept?: Accept;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = true,
  maxSize,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (dropped: File[]) => {
    if (disabled || isUploading) return;
    setFiles(multiple ? [...files, ...dropped] : dropped);
  };

  const removeFile = (index: number) => {
    if (isUploading) return;
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || disabled || isUploading) return;
    setIsUploading(true);
    try {
      await onUpload?.(files);
      setFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    noClick: true,
    accept,
    maxSize,
    disabled,
    onDrop: handleDrop,
    onDropRejected: (errors) => console.error("File upload rejected:", errors),
  });

  return (
    <div className={cn("flex flex-col gap-4", className)} {...getRootProps()}>
      <motion.div
        onClick={() => !disabled && fileInputRef.current?.click()}
        whileHover={disabled ? undefined : "animate"}
        className={cn(
          "group/file relative flex flex-col min-h-[300px] h-auto w-full items-center justify-center",
          "border border-dashed border-outline-minor cursor-pointer overflow-hidden transition-colors",
          disabled && "cursor-not-allowed opacity-50",
          isDragActive && "border-primary bg-primary-light/30",
          !disabled && !isDragActive && "hover:border-primary hover:bg-stone-100",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept ? Object.keys(accept).join(",") : undefined}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleDrop(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex relative z-10 flex-col justify-center items-center min-h-40">
          <p className="text-sm font-medium text-text-primary">Upload file</p>
          <p className="mt-1 text-xs text-text-secondary">Drag and drop your file here, or click to browse</p>

          {files.length === 0 && (
            <div className="relative mx-auto mt-6 w-full max-w-[8rem]">
              <motion.div
                layoutId="file-upload-icon"
                variants={{ initial: { x: 0, y: 0 }, animate: { x: 12, y: -12, opacity: 0.9 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex relative z-40 justify-center items-center mx-auto w-16 h-16 bg-white rounded-md shadow-md group-hover/file:shadow-lg"
              >
                {isDragActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-primary"
                  >
                    <span className="text-xs font-medium">Drop it</span>
                    <UploadCloudIcon className="mt-1 size-5" />
                  </motion.div>
                ) : (
                  <UploadCloudIcon className="size-6 text-text-secondary" />
                )}
              </motion.div>

              <motion.div
                variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                className={cn(
                  "absolute inset-0 z-30 mx-auto flex h-16 w-16 items-center justify-center rounded-md",
                  "border border-dashed border-primary bg-transparent opacity-0",
                )}
              />
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { height: { delay: 0.15 } } }}
            className="flex flex-col gap-4 items-center"
          >
            <div
              className={cn(
                "relative z-40 mt-auto w-full group-hover/file:border-primary group-hover/file:divide-primary",
                "divide-y divide-outline-minor border border-outline-minor border-dashed divide-dashed",
              )}
            >
              {files.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 items-center p-3 w-full"
                >
                  <div className="flex justify-center items-center rounded-md size-10 shrink-0 bg-primary-light">
                    <FileIcon className="size-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-text-primary">{file.name}</p>
                    <p className="text-xs text-text-secondary">
                      {formatFileSize(file.size)} • {file.type || "Unknown type"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    disabled={isUploading}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors",
                      "hover:bg-red-100/50 hover:text-red-500",
                      isUploading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <XIcon className="size-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={disabled || isUploading}
              className={cn(
                "py-2.5 px-4 font-medium text-sm transition-colors btn-primary-light md:w-52 max-w-xs w-full",
                (disabled || isUploading) && "opacity-50 cursor-not-allowed",
              )}
            >
              {isUploading ? (
                <span className="flex gap-2 items-center">
                  <Spinner className="size-4" />
                  Uploading...
                </span>
              ) : (
                `Upload ${files.length} file${files.length > 1 ? "s" : ""}`
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}
