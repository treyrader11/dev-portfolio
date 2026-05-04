// "use client";

// import { cn } from "@/lib/utils";
// import { FiSearch } from "react-icons/fi";
// import { MdClear } from "react-icons/md";
// import { forwardRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Props {
//   className?: string;
//   onChange: (text: string) => void;
//   clearInput: () => void;
//   onClick: () => void;
//   isFocused: boolean;
// }

// const Search = forwardRef<HTMLInputElement, Props>(function Search(
//   { className, onChange, clearInput, onClick, isFocused },
//   ref,
// ) {
//   return (
//     <motion.div
//       animate={{
//         width: isFocused ? "100%" : 24,
//         borderBottomWidth: isFocused ? 0.3 : 0,
//       }}
//       transition={{
//         width: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
//         borderBottomWidth: { duration: 0.3, delay: isFocused ? 0.2 : 0 },
//       }}
//       className={cn(
//         "h-fit",
//         "items-center",
//         "text-white",
//         "gap-x-2",
//         "inline-flex",
//         "border-b-white/40",
//         "md:max-w-1/2",
//         "overflow-hidden",
//         "flex-shrink-0",
//         className,
//       )}
//     >
//       <form
//         className={cn(
//           "bg-transparent",
//           "flex items-center",
//           "text-2xl",
//           "w-full",
//           "relative",
//         )}
//         onSubmit={(e) => e.preventDefault()}
//       >
//         <FiSearch
//           onClick={onClick}
//           className={cn(
//             "absolute",
//             "flex-shrink-0",
//             "text-2xl",
//             "cursor-pointer",
//             "hover:opacity-70",
//             "transition-opacity",
//             "duration-200",
//           )}
//         />
//         <motion.input
//           ref={ref}
//           placeholder="Search by stack..."
//           onChange={(e) => onChange(e.target.value)}
//           type="text"
//           autoComplete="off"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: isFocused ? 1 : 0 }}
//           transition={{ duration: 0.3, delay: isFocused ? 0.15 : 0 }}
//           className={cn(
//             "px-3",
//             "ml-8",
//             "sm:ml-10",
//             "font-extralight",
//             "placeholder:font-extralight",
//             "placeholder:text-slate-300/60",
//             "focus-visible:outline-none",
//             "bg-transparent",
//             "w-full",
//           )}
//         />
//         <AnimatePresence>
//           {isFocused && (
//             <motion.button
//               type="button"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.5 }}
//               transition={{ duration: 0.2 }}
//               onClick={() => clearInput()}
//               className={cn(
//                 "text-neutral-400",
//                 "cursor-pointer",
//                 "hover:text-white",
//                 "transition-colors",
//                 "duration-200",
//                 "ml-auto",
//                 "flex-shrink-0",
//                 "relative",
//                 "z-[50]",
//                 "text-2xl",
//               )}
//             >
//               <MdClear />
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </form>
//     </motion.div>
//   );
// });

// export default Search;

"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { MdClear } from "react-icons/md";

interface Props {
  className?: string;
  onChange: (text: string) => void;
  clearInput: () => void;
  onClick: () => void;
  isFocused: boolean;
  placeholder?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  expandedOffset?: number;
  gooeyBlur?: number;
}

const transition = {
  duration: 0.4,
  type: "spring" as const,
  bounce: 0.25,
};

const iconBubbleVariants = {
  collapsed: { scale: 1, opacity: 1 },
  expanded: { scale: 1, opacity: 1 },
};

function GooeyFilter({ filterId, blur }: { filterId: string; blur: number }) {
  return (
    <svg className="absolute hidden h-0 w-0" aria-hidden>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blur}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

const Search = forwardRef<HTMLInputElement, Props>(function Search(
  {
    className,
    onChange,
    clearInput,
    onClick,
    isFocused,
    placeholder = "Search by stack...",
    collapsedWidth = 48,
    expandedWidth = 320,
    expandedOffset = 50,
    gooeyBlur = 5,
  },
  ref,
) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-search-filter-${safeId}`;
  const inputLayoutId = `gooey-search-input-${safeId}`;

  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const [searchText, setSearchText] = useState("");

  // Focus the input whenever the parent expands the search
  useEffect(() => {
    if (isFocused) {
      // small timeout so the input becomes interactive after expansion starts
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    } else {
      setSearchText("");
    }
  }, [isFocused]);

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: { width: expandedWidth, marginLeft: expandedOffset },
    }),
    [collapsedWidth, expandedWidth, expandedOffset],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setSearchText("");
    if (inputRef.current) inputRef.current.value = "";
    clearInput();
    inputRef.current?.focus();
  }, [clearInput]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-start flex-shrink-0",
        className,
      )}
    >
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />

      <div
        className="relative flex h-12 items-center"
        style={{ filter: `url(#${filterId})` }}
      >
        {/* Main pill */}
        <motion.div
          className="flex h-12 items-center"
          variants={buttonVariants}
          initial="collapsed"
          animate={isFocused ? "expanded" : "collapsed"}
          transition={transition}
        >
          <div
            onClick={!isFocused ? onClick : undefined}
            role={!isFocused ? "button" : undefined}
            tabIndex={!isFocused ? 0 : -1}
            onKeyDown={(e) => {
              if (!isFocused && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onClick();
              }
            }}
            aria-label={!isFocused ? "Open search" : undefined}
            className={cn(
              "flex h-12 w-full items-center gap-2 rounded-full px-4",
              "bg-white text-dark shadow-sm ring-1 ring-white/10",
              "outline-none transition-[color,box-shadow]",
              !isFocused && "cursor-pointer",
              "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark",
            )}
          >
            {/* Spacer to reserve room for the detached icon bubble */}
            <span className="w-12 shrink-0" aria-hidden />

            <motion.input
              layoutId={inputLayoutId}
              ref={inputRef}
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              value={searchText}
              onChange={handleChange}
              disabled={!isFocused}
              placeholder={placeholder}
              className={cn(
                "search-pill-input h-full min-w-0 flex-1 bg-transparent text-base font-extralight outline-none",
                "text-dark",
                isFocused
                  ? "placeholder:text-dark/50"
                  : "pointer-events-none placeholder:text-dark/70",
              )}
            />

            {isFocused ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchText) {
                    handleClear();
                  } else {
                    onClick();
                  }
                }}
                aria-label={searchText ? "Clear search" : "Close search"}
                className={cn(
                  "ml-auto flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
                  "text-secondary hover:bg-secondary/10 transition-colors duration-200 text-xl",
                )}
              >
                <MdClear />
              </motion.button>
            ) : null}
          </div>
        </motion.div>

        {/* Detached gooey bubble that holds the icon while expanded */}
        <motion.div
          className="absolute inset-y-0 left-0 flex w-12 items-center justify-center pointer-events-none"
          variants={iconBubbleVariants}
          initial="collapsed"
          animate={isFocused ? "expanded" : "collapsed"}
          transition={transition}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white text-dark shadow-sm ring-1 ring-white/10">
            <FiSearch className="text-2xl shrink-0" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Search;
