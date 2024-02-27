import { useCallback, useMemo, useRef, useState, type ComponentType } from "react";
import { ModalContext, ModalContextValue } from "./context";

export type ShowFunc<P, R = unknown> = (props: P) => Promise<R>;

type PromiseFuncs<V, R> = {
  reject: (reason: R) => void;
  resolve: (value: V) => void;
};

export function useModal<R = unknown, P = object>(ModalComponent: ComponentType<P>) {
  const [visible, setVisible] = useState(false);

  const promiseRef = useRef<PromiseFuncs<R, unknown>>();
  const [modalProps, setModalProps] = useState<P>();

  const placeholder = useMemo(() => {
    if (!(modalProps && promiseRef.current)) {
      return null;
    }
    return (
      <ModalContext.Provider
        value={{
          visible,
          reject: promiseRef.current.reject,
          resolve: promiseRef.current.resolve,
          destroy() {
            setModalProps(undefined);
            promiseRef.current = undefined;
          },
        }}
      >
        <ModalComponent {...modalProps} />
      </ModalContext.Provider>
    );
  }, [ModalComponent, modalProps, visible]);

  const show = useCallback<ShowFunc<P, R>>(async (props) => {
    try {
      setModalProps(props);
      setVisible(true);
      return await new Promise<R>((resolve, reject) => {
        promiseRef.current = { reject, resolve };
      });
    } finally {
      setVisible(false);
    }
  }, []);

  return useMemo(() => {
    return {
      show,
      placeholder,
    };
  }, [placeholder, show]);
}
