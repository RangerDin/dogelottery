import { toast } from "react-hot-toast";
import { TOAST_VARIANT, ToastOptions } from "./declarations";
import { TOAST_STYLE_BY_VARIANT } from "~/ui/toasts/constants";

type ToastFunction = (
  toastContent: JSX.Element | string,
  toastOptions?: ToastOptions
) => void;

type UseToastResult = {
  toast: ToastFunction;
};

const useToast = (): UseToastResult => {
  const addToast: ToastFunction = (
    toastContent,
    toastOptions = {
      variant: TOAST_VARIANT.DEFAULT
    }
  ) => {
    const style = TOAST_STYLE_BY_VARIANT[toastOptions.variant];

    toast(toastContent, {
      style
    });
  };

  return {
    toast: addToast
  };
};

export default useToast;
