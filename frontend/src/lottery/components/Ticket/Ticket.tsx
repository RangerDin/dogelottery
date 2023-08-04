import TicketSlot from "~/lottery/components/Ticket/TicketSlot";
import { LOTTERY_TICKET_SLOTS } from "~/lottery/constants";
import {
  LotteryTicket,
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

import styles from "./styles.module.css";

type Props = {
  ticket: LotteryTicket;
  disabled?: boolean;
  highlightedSlots?: boolean;
  className?: string;
  onClick?: () => void;
  onClickSlot?: (slot: LotteryTicketSlot) => void;
};

const Ticket = ({
  ticket,
  disabled,
  highlightedSlots,
  className,
  onClick,
  onClickSlot
}: Props): JSX.Element => {
  const ticketOpened = ticket.status === LotteryTicketStatus.OPENED;

  const handleClickSlot = (slotId: LotteryTicketSlot) => () => {
    onClickSlot?.(slotId);
  };

  const backgroundImage = ticketOpened
    ? `linear-gradient(45deg, hsl(${ticket.ticketHue}, 80%, 20%), #111)`
    : "";

  return (
    <article
      className={`${className} ${styles.ticket} ${disabled && styles.disabled}`}
      style={{
        backgroundImage
      }}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      <div
        className={`${styles.ticketCover} ${
          ticketOpened ? styles.ticketCoverScratched : ""
        }`}
      />
      <div className={styles.ticketSlotContainer}>
        {new Array(LOTTERY_TICKET_SLOTS).fill(null).map((_, index) => (
          <TicketSlot
            key={index}
            slot={index}
            highlighted={highlightedSlots}
            disabled={disabled || ticket.status !== LotteryTicketStatus.NEW}
            opened={
              ticket.status === LotteryTicketStatus.OPENED &&
              ticket.openedSlot === index
            }
            winning={
              ticket.status === LotteryTicketStatus.OPENED &&
              ticket.winningSlot === index
            }
            onClick={handleClickSlot(index)}
          />
        ))}
      </div>
    </article>
  );
};

export default Ticket;
