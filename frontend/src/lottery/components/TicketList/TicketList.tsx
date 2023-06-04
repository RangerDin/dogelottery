import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";

type Props = {
  className?: string;
  tickets: LotteryTicket[];
  onClickTicket: (ticketId: LotteryTicketId) => void;
};

const TicketList = ({
  className,
  tickets,
  onClickTicket
}: Props): JSX.Element => {
  const handleClickLotteryTicket = (ticketId: LotteryTicketId) => () => {
    onClickTicket(ticketId);
  };

  return (
    <section>
      <h3>Tickets:</h3>
      <ul className={className}>
        {tickets.map(({ id }) => (
          <li key={id}>
            <button onClick={handleClickLotteryTicket(id)}>Ticket #{id}</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TicketList;
