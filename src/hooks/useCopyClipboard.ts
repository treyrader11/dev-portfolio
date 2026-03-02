"use client";

import { useState, useCallback } from "react";
import type { UseCopyToClipboardReturn } from "@/types/hooks";

const useCopyToClipboard = (timeout = 5000): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(
    (text: string) => {
      setCopied(true);
      navigator.clipboard.writeText(text);
      const myTimeout = setTimeout(() => {
        setCopied(false);
      }, timeout);

      return () => clearTimeout(myTimeout);
    },
    [timeout]
  );

  return [copied, copy];
};

export default useCopyToClipboard;
