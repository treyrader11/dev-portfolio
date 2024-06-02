"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function BlockGrid({ className }) {
  const blockContainerRef = useRef(null);
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);
  const blockSize = 50;

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const cols = Math.ceil(screenWidth / blockSize);
    const rows = Math.ceil(screenHeight / blockSize);
    setNumCols(cols);
    setNumRows(rows);
  }, []);

  useEffect(() => {
    createBlocks();
  }, [numCols, numRows]);

  const createBlocks = () => {
    const blockContainer = blockContainerRef.current;
    if (blockContainer) {
      blockContainer.innerHTML = "";
      const numBlocks = numCols * numRows;
      for (let i = 0; i < numBlocks; i++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.dataset.index = i;
        block.addEventListener("mousemove", highlightRandomNeighbors);
        blockContainer.appendChild(block);
      }
    }
  };

  const highlightRandomNeighbors = (event) => {
    const block = event.target;
    const index = parseInt(block.dataset.index);
    const neighbors = [
      index - 1,
      index + 1,
      index - numCols,
      index + numCols,
      index - numCols - 1,
      index - numCols + 1,
      index + numCols - 1,
      index + numCols + 1,
    ].filter(
      (i) =>
        i >= 0 &&
        i < numCols * numRows &&
        Math.abs((i % numCols) - (index % numCols)) <= 1
    );

    block.classList.add("highlight");
    setTimeout(() => {
      block.classList.remove("highlight");
    }, 500);

    shuffleArray(neighbors)
      .slice(0, 1)
      .forEach((nIndex) => {
        const neighbor = blockContainerRef.current.children[nIndex];
        if (neighbor) {
          neighbor.classList.add("highlight");
          setTimeout(() => {
            neighbor.classList.remove("highlight");
          }, 500);
        }
      });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div
      ref={blockContainerRef}
      className={cn(
        "bg-dark",
        "w-[105vw]",
        "h-screen",
        "flex-wrap",
        "justify-start",
        "items-start",
        "overflow-hidden",
        className
      )}
      id="blocks"
    />
  );
}
