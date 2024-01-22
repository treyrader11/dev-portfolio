import { cn } from "@/lib/utils";
import styles from "./styles";

export default function Container({ classname, children, maxWidth }) {
  return (
    <div className={classname} style={{ maxWidth }}>
      {children}
    </div>
  );
}
