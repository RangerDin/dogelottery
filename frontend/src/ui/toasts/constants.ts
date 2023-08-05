import { CSSProperties } from "react";
import { TOAST_VARIANT } from "~/ui/toasts/declarations";

export const TOAST_STYLE_BY_VARIANT: Record<TOAST_VARIANT, CSSProperties> = {
  [TOAST_VARIANT.DEFAULT]: {
    color: "#fff",
    background: "#6b6bc4"
  },
  [TOAST_VARIANT.ERROR]: {
    color: "f00"
  }
};
