import { forwardRef } from "react";
import styles from "./styles.module.css";
import Button from "~/ui/Button";

type Props = {
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const KioskBuyTicketButton = forwardRef<HTMLButtonElement, Props>(
  ({ disabled, className, onClick }: Props, ref): JSX.Element => {
    return (
      <Button
        ref={ref}
        disabled={disabled}
        className={`${styles.buyTicketButton} ${className}`}
        onClick={onClick}
      >
        Buy ticket
      </Button>
    );
  }
);

KioskBuyTicketButton.displayName = "KioskBuyTicketButton";

export default KioskBuyTicketButton;
