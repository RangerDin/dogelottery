import styles from "./styles.module.css";
import {
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

type Props = {
  slot: LotteryTicketSlot;
  winning: boolean;
  status:
    | LotteryTicketStatus.OPENED
    | LotteryTicketStatus.OPENING
    | LotteryTicketStatus.NEW;
  disabled?: boolean;
  onClick?: () => void;
};

const TicketSlot = ({
  slot,
  winning,
  disabled,
  onClick
}: Props): JSX.Element => {
  return (
    <button className={styles.ticketSlot} disabled={disabled} onClick={onClick}>
      {winning && <span>winning</span>}
    </button>
  );
};

export default TicketSlot;
