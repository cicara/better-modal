import { ComponentType, useCallback, useMemo, useRef, useState } from "react";
import { ModalContext } from "./context.js";

export type ShowFunc<P, R = unknown> = (props: P) => Promise<R>;

type PromiseFuncs<V, R> = {
  reject: (reason: R) => void;
  resolve: (value: V) => void;
};

export function useModal<P>(ModalComponent: ComponentType<P>) {
  const [visible, setVisible] = useState(false);

  const promiseRef = useRef<PromiseFuncs<any, unknown>>();
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

  const show = useCallback(async function <R>(props: P) {
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

  const update = useCallback((props: P) => {
    setModalProps(props);
  }, []);

  return useMemo(() => {
    return {
      show,
      update,
      placeholder,
    };
  }, [placeholder, show, update]);
}
