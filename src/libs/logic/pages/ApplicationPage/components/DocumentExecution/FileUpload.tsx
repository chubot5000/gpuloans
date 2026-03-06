"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "logic/utils";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Button, Spinner } from "ui/components";

export interface FileUploadProps {
  /** Called when files are uploaded */
  onUpload?: (files: File[]) => Promise<void> | void;
  /** Accepted file types (e.g., { "application/pdf": [".pdf"] }) */
  accept?: Accept;
  /** Allow multiple file selection (default: false) */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Disable the uploader */
  disabled?: boolean;
  /** Additional class names for the container */
  className?: string;
  /** Custom upload button text */
  uploadButtonText?: string;
  /** Custom placeholder text */
  placeholder?: string;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  className,
  uploadButtonText,
  placeholder,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFiles = files.length > 0;

  const handleDrop = (dropped: File[]) => {
    if (disabled || isUploading) return;
    setFiles(multiple ? [...files, ...dropped] : dropped.slice(0, 1));
  };

  const removeFile = (index: number) => {
    if (isUploading) return;
    setFiles(files.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasFiles || disabled || isUploading) return;

    setIsUploading(true);
    try {
      await onUpload?.(files);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePicker = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    noClick: true,
    accept,
    maxSize,
    disabled: disabled || isUploading,
    onDrop: handleDrop,
    onDropRejected: (errors) => console.error("File rejected:", errors),
  });

  const defaultPlaceholder = accept
    ? `Drag and drop your file here (${Object.values(accept).flat().join(", ")})`
    : "Drag and drop your file here, or click to browse";

  const defaultButtonText = files.length > 1 ? `Upload ${files.length} files` : "Upload";

  return (
    <div className={cn("flex flex-col gap-4 p-8 shadow-base", className)} {...getRootProps()}>
      {/* Drop Zone */}
      <motion.div
        onClick={openFilePicker}
        whileHover={disabled ? undefined : "animate"}
        className={cn(
          "group/file relative flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden",
          "border border-dashed border-outline-minor transition-colors",
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
          disabled={disabled || isUploading}
          onChange={(e) => handleDrop(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex relative z-10 flex-col justify-center items-center min-h-40">
          <p className="text-sm font-medium text-text-primary">Upload file</p>
          <p className="mt-1 text-xs text-text-secondary">{placeholder ?? defaultPlaceholder}</p>

          {!hasFiles && (
            <div className="relative mx-auto mt-6 w-full max-w-[8rem]">
              <motion.div
                layoutId="file-upload-icon"
                variants={{
                  initial: { x: 0, y: 0 },
                  animate: { x: 12, y: -12, opacity: 0.9 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex relative z-40 justify-center items-center mx-auto bg-white rounded-md shadow-md size-16 group-hover/file:shadow-lg"
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
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                }}
                className="flex absolute inset-0 z-30 justify-center items-center mx-auto bg-transparent rounded-md border border-dashed opacity-0 size-16 border-primary"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { height: { delay: 0.15 } } }}
            className="flex flex-col gap-4 items-center"
          >
            <div
              className={cn(
                "relative z-40 w-full divide-y divide-dashed divide-outline-minor",
                "border border-dashed border-outline-minor",
                "group-hover/file:divide-primary group-hover/file:border-primary",
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
                      "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                      "text-text-secondary hover:bg-red-100/50 hover:text-red-500",
                      isUploading && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <XIcon className="size-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={disabled || isUploading}
              className={cn(
                "btn-primary-light w-full max-w-xs px-4 py-2.5 text-sm font-medium transition-colors md:w-52",
                (disabled || isUploading) && "cursor-not-allowed opacity-50",
              )}
            >
              {isUploading ? (
                <span className="flex gap-2 items-center">
                  <Spinner className="size-4" />
                  Uploading...
                </span>
              ) : (
                (uploadButtonText ?? defaultButtonText)
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
