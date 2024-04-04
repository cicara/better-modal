import { useContext, type Context } from "react";
import { ModalContext, type ModalContextValue } from "./context.js";

export function useModalContext<R = unknown>() {
  const value = useContext(ModalContext as Context<ModalContextValue<R> | undefined>);
  if (!value) {
    throw new Error("must use modal context with better-modal hook");
  }
  return value;
}
