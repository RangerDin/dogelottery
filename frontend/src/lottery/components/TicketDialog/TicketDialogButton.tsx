import Button from "~/ui/Button";
import styles from "./styles.module.css";
import { MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const TicketDialogButton = ({
  className,
  disabled,
  children,
  onClick
}: Props): JSX.Element | null => {
  return (
    <Button
      disabled={disabled}
      className={`${className} ${styles.ticketDialogButton}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default TicketDialogButton;
