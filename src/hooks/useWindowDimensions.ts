import { useState, useEffect } from "react";
import type { WindowDimensions } from "@/types/hooks";

function getWindowDimensions(): WindowDimensions {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }
  return { width: 0, height: 0 };
}

export function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = (): void => setWindowDimensions(getWindowDimensions());

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowDimensions;
}

export function useWindowScroll(callback: () => void): void {
  useEffect(() => {
    const handleScroll = (): void => callback();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);
}

// Hook to check if the device is mobile (width <= 760)
export function useIsMobile(): boolean {
  const { width } = useWindowDimensions();
  return width <= 760;
}
