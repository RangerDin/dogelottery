import { useCallback, useState } from "react";

export type UseDialogOpenHandler<T> = (newPayload?: T) => void;
export type UseDialogSetPayloadHandler<T> = (newPayload: T) => void;
export type UseDialogCloseHandler = () => void;
export type UseDialogExitedHandler = () => void;

type InitialOptions<T = undefined> =
  | ({
      open: true;
    } & (T extends undefined ? Record<string, never> : { payload: T }))
  | {
      open: false;
      payload?: T;
    };

type UseDialogOptions<T> = {
  initial?: InitialOptions<T>;
};

type UseDialogHookPayload<T> =
  | ({
      mounted: true;
    } & (T extends undefined ? Record<string, never> : { payload: T }))
  | {
      mounted: false;
      payload?: T;
    };

export type DialogProps = {
  open: boolean;
  onClose: UseDialogCloseHandler;
  onExited: UseDialogExitedHandler;
};

export type UseDialogHookResult<T = undefined> = {
  openDialog: UseDialogOpenHandler<T>;
  setPayload: UseDialogSetPayloadHandler<T>;
  dialogProps: DialogProps;
} & UseDialogHookPayload<T>;

type UseDialogHookState<T> = UseDialogHookPayload<T> & {
  open: boolean;
};

const useDialog = <T = undefined>({
  initial = { open: false }
}: UseDialogOptions<T> = {}): UseDialogHookResult<T> => {
  const [state, setState] = useState<UseDialogHookState<T>>(() => {
    if (initial.open) {
      return {
        mounted: true,
        open: true,
        payload: initial.payload
      };
    }

    return {
      mounted: false,
      open: false,
      payload: initial.payload
    };
  });

  const setPayload = useCallback((newPayload: T): void => {
    setState(state => ({ ...state, payload: newPayload }));
  }, []);

  const onClose = useCallback((): void => {
    setState(state => {
      if (!state.open) {
        return state;
      }

      return {
        open: false,
        mounted: true,
        payload: state.payload
      };
    });
  }, []);

  const onExited = useCallback(() => {
    setState(() => ({
      open: false,
      mounted: false,
      payload: undefined
    }));
  }, []);

  const openDialog = useCallback((newPayload?: T): void => {
    setState(state => ({
      ...state,
      open: true,
      mounted: true,
      payload: newPayload ?? state.payload
    }));
  }, []);

  return {
    ...state,
    setPayload,
    openDialog,
    dialogProps: {
      onClose,
      onExited,
      open: state.open
    }
  };
};

export default useDialog;
