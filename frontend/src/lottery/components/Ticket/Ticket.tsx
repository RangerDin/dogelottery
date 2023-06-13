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
  className?: string;
  onClickSlot: (slot: LotteryTicketSlot) => void;
};

const Ticket = ({
  ticket,
  disabled,
  className,
  onClickSlot
}: Props): JSX.Element => {
  const handleClickSlot = (slotId: LotteryTicketSlot) => () => {
    onClickSlot(slotId);
  };

  return (
    <article className={`${className} ${styles.ticket}`}>
      <h3 className={styles.ticketContentTitle}>#{ticket.id}</h3>
      <div className={styles.ticketSlotContainer}>
        {new Array(LOTTERY_TICKET_SLOTS).fill(null).map((_, index) => (
          <TicketSlot
            key={index}
            slot={index}
            status={ticket.status}
            disabled={disabled || ticket.status !== LotteryTicketStatus.NEW}
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
