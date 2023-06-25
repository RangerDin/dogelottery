import Ticket from "~/lottery/components/Ticket/Ticket";
import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";
import styles from "./styles.module.css";

type Props = {
  tickets: LotteryTicket[];
  onClickTicket: (ticketId: LotteryTicketId) => void;
};

const KioskTickets = ({ tickets, onClickTicket }: Props): JSX.Element => {
  const handleClickLotteryTicket = (ticketId: LotteryTicketId) => () => {
    onClickTicket(ticketId);
  };

  return (
    <>
      {tickets.map(ticket => (
        <Ticket
          key={ticket.id}
          className={styles.ticket}
          ticket={ticket}
          onClick={handleClickLotteryTicket(ticket.id)}
          disabled
        />
      ))}
    </>
  );
};

export default KioskTickets;
