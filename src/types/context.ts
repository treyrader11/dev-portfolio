import type { Dispatch, SetStateAction } from "react";
import type { UseNotificationsReturn, PositionValues } from "./hooks";

export interface NavContextValue {
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
}

export type NotificationsContextValue = UseNotificationsReturn;

export type PositionContextValue = PositionValues;
