import { forwardRef } from "react";
import styles from "./styles.module.css";

type Props = {
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const KioskBuyTicketButton = forwardRef<HTMLButtonElement, Props>(
  ({ disabled, className, onClick }: Props, ref): JSX.Element => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${styles.buyTicketButton} ${className}`}
        onClick={onClick}
      >
        Buy ticket
      </button>
    );
  }
);

KioskBuyTicketButton.displayName = "KioskBuyTicketButton";

export default KioskBuyTicketButton;
