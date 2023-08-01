import TicketWinningSlot from "~/lottery/components/Ticket/TicketWinningSlot";
import styles from "./styles.module.css";
import {
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

type Props = {
  slot: LotteryTicketSlot;
  opened: boolean;
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
  opened,
  winning,
  disabled,
  onClick
}: Props): JSX.Element => {
  return (
    <button
      className={`${styles.ticketSlot} ${
        opened ? styles.ticketSlotOpened : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {opened && winning && <TicketWinningSlot />}
    </button>
  );
};

export default TicketSlot;
