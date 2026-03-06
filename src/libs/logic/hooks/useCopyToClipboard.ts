"use client";

import { useRef, useState } from "react";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  function copy(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);

        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
          setIsCopied(false);
          timeout.current = null;
        }, 2000);
      })
      .catch(() => null);
  }

  return { copy, isCopied };
}
