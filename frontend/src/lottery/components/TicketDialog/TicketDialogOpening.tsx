import Ticket from "~/lottery/components/Ticket";
import TicketDialogButton from "./TicketDialogButton";
import {
  LotteryTicket,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  ticket: LotteryTicket;
  opening: boolean;
  handlers: LotteryPageHandlers;
};

const TicketDialogOpening = ({
  ticket,
  opening,
  handlers: { openTicket, cancelOpeningTicket }
}: Props): JSX.Element | null => {
  const handleClickSlot = (slot: LotteryTicketSlot) => {
    openTicket(ticket.id, slot);
  };

  return (
    <>
      <Ticket ticket={ticket} onClickSlot={handleClickSlot} />
      <TicketDialogButton disabled={opening} onClick={cancelOpeningTicket}>
        Cancel
      </TicketDialogButton>
      <div>To open ticket click on one of the slots</div>
    </>
  );
};

export default TicketDialogOpening;
