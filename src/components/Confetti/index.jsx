import { cn } from "@/lib/utils";
import Lottie from "react-lottie";
import animationData from "@/lib/confetti.json";

export default function Confetti({ copied, className }) {
  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className={cn(
        "absolute",
        "-bottom-5",
        "right-0",
        copied ? "block" : "block",
        className
      )}
    >
      <Lottie options={defaultOptions} height={200} width={400} />
    </div>
  );
}
