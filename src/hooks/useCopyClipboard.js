"use client";

import { useState, useCallback } from "react";

const useCopyToClipboard = (timeout = 5000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text) => {
      setCopied(true);
      navigator.clipboard.writeText(text);
      // const myTimeout = setTimeout(() => {
      //   setCopied(false);
      // }, timeout);

      // return () => clearTimeout(myTimeout);
      return () => setCopied(false);
    },
    [timeout]
  );

  return [copied, copy];
};

export default useCopyToClipboard;
