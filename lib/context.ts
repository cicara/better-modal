import { createContext } from "react";

export type ModalContextValue<R> = {
  visible: boolean;
  reject: (reason: unknown) => void;
  resolve: R extends void ? () => void : (value: R) => void;
  destroy: () => void;
};

export const ModalContext = createContext<ModalContextValue<any> | undefined>(undefined);
