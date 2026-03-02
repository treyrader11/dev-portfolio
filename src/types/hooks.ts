import type { Dispatch, SetStateAction } from "react";

export interface Notification {
  id: string;
  text?: string;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

export interface MousePosition {
  x: number | null;
  y: number | null;
}

export interface WindowDimensions {
  width: number;
  height: number;
}

export interface PositionValues {
  activePosition: number;
  setActivePosition: Dispatch<SetStateAction<number>>;
  activePositionProgress: number;
  setActivePositionProgress: Dispatch<SetStateAction<number>>;
}

export interface UsePositionValuesReturn {
  values: PositionValues;
}

export type UseCopyToClipboardReturn = [boolean, (text: string) => () => void];
