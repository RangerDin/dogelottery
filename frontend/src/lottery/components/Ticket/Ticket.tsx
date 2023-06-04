import TicketSlot from "~/lottery/components/Ticket/TicketSlot";
import { LOTTERY_TICKET_SLOTS } from "~/lottery/constants";
import {
  LotteryTicket,
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

type Props = {
  ticket: LotteryTicket;
  onClickSlot: (slot: LotteryTicketSlot) => void;
};

const Ticket = ({ ticket, onClickSlot }: Props): JSX.Element => {
  const handleClickSlot = (slotId: LotteryTicketSlot) => () => {
    onClickSlot(slotId);
  };

  return (
    <article>
      <h3>Ticket #{ticket.id}</h3>
      <ul>
        {new Array(LOTTERY_TICKET_SLOTS).fill(null).map((_, index) => (
          <li key={index}>
            <TicketSlot
              slot={index}
              status={ticket.status}
              disabled={ticket.status !== LotteryTicketStatus.NEW}
              winning={
                ticket.status === LotteryTicketStatus.OPENED &&
                ticket.winningSlot === index
              }
              onClick={handleClickSlot(index)}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Ticket;
