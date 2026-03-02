import { createContext } from "react";
import type { NavContextValue, NotificationsContextValue, PositionContextValue } from "@/types/context";

const PositionContext = createContext<PositionContextValue | null>(null);
const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);
const NavContext = createContext<NavContextValue | undefined>(undefined);

export { PositionContext, NotificationsContext, NavContext };
