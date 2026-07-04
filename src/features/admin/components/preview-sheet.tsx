import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Responsive preview container: a centered modal on desktop and a full-screen
// sheet on mobile (as requested). Used to preview the parsed .env / package.json
// exactly as they'll render on the public project page. Sits above the admin
// focus backdrop (z-40) and confirm dialogs (z-60).
export function PreviewSheet({ open, title, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex sm:items-center sm:justify-center sm:p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-dark-400 sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-lg sm:border sm:border-dark-600 sm:shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-dark-600 px-4 py-3">
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <button
                type="button"
                aria-label="Close preview"
                onClick={onClose}
                className="text-light-400 hover:text-white"
              >
                <RiCloseLine className="size-5" />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
