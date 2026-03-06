"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllDealFiles } from "data/fetchers";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Drawer, Spinner } from "ui/components";

import { useApplication } from "../../ApplicationPageProvider";

interface DocumentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentsDrawer(props: DocumentsDrawerProps) {
  const { isOpen, onClose } = props;
  const { dealId } = useApplication();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-deal-files", dealId],
    queryFn: () => getAllDealFiles(dealId),
    enabled: isOpen && Boolean(dealId),
  });

  const filteredFiles = useMemo(() => {
    if (!data?.files) return [];

    if (!searchQuery.trim()) return data.files;

    const query = searchQuery.toLowerCase();
    return data.files.filter(
      (file) => file.name.toLowerCase().includes(query) || file.file_name.toLowerCase().includes(query),
    );
  }, [data?.files, searchQuery]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} className="w-full sm:w-[660px] !px-11 !py-9">
      <Drawer.Title>Documents</Drawer.Title>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="size-7" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-3 h-11 bg-bg-primary border-b border-outline-minor">
            <SearchIcon className="size-5 text-text-secondary shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-base text-text-primary placeholder:text-text-secondary outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-text-secondary hover:text-text-primary"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col">
            {filteredFiles.length === 0 ? (
              <div className="py-8 text-center text-text-secondary">
                {searchQuery ? "No documents match your search" : "No documents uploaded yet"}
              </div>
            ) : (
              filteredFiles.map((file) => <DocumentRow key={file.id} name={file.name} downloadUrl={file.downloadUrl} />)
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}

interface DocumentRowProps {
  name: string;
  downloadUrl: string;
}

function DocumentRow(props: DocumentRowProps) {
  const { name, downloadUrl } = props;

  return (
    <div className="flex items-center justify-between h-[59px] px-2 border-b border-outline-minor">
      <span className="text-sm text-text-primary truncate flex-1 mr-4">{name}</span>

      <div className="flex items-center gap-4 shrink-0">
        <Link
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-fill-primary hover:underline"
        >
          View
        </Link>

        <span className="h-[17px] w-px bg-outline-minor" />

        <a
          href={`${downloadUrl}&filename=${encodeURIComponent(name)}`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-fill-primary hover:underline"
        >
          Download
        </a>
      </div>
    </div>
  );
}
