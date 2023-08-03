import styles from "./styles.module.css";
import { ChangeEventHandler } from "react";
import SlideUp from "~/ui/animation/SlideUp";

const NEGATIVE_MARGIN = 77;

type Props = {
  in: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const TicketDialogInput = ({
  in: inProp,
  value,
  onChange
}: Props): JSX.Element | null => {
  return (
    <SlideUp in={inProp} height={NEGATIVE_MARGIN} mountOnEnter unmountOnExit>
      <input
        className={styles.ticketDialogAddress}
        placeholder="Address"
        value={value}
        onChange={onChange}
      />
    </SlideUp>
  );
};

export default TicketDialogInput;
