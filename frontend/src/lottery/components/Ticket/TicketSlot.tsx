import TicketWinningSlot from "~/lottery/components/Ticket/TicketWinningSlot";
import styles from "./styles.module.css";
import {
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import Fade from "~/ui/animation/Fade/Fade";

type Props = {
  slot: LotteryTicketSlot;
  opened: boolean;
  winning: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const TicketSlot = ({
  opened,
  highlighted,
  winning,
  disabled,
  onClick
}: Props): JSX.Element => {
  return (
    <button
      className={`${styles.ticketSlot} ${
        opened ? styles.ticketSlotOpened : ""
      } ${highlighted ? styles.ticketSlotHighlighted : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <Fade in={opened && winning} mountOnEnter unmountOnExit>
        <TicketWinningSlot />
      </Fade>
    </button>
  );
};

export default TicketSlot;
