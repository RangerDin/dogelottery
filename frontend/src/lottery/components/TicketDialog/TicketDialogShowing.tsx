import Ticket from "~/lottery/components/Ticket";
import { LotteryTicket } from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import styles from "./styles.module.css";
import TicketDialogButton from "~/lottery/components/TicketDialog/TicketDialogButton";

type Props = {
  ticket: LotteryTicket;
  handlers: LotteryPageHandlers;
};

const TicketDialogShowing = ({
  ticket,
  handlers: { offerToOpenTicket, offerToSendTicket }
}: Props): JSX.Element | null => {
  const handleClickOpenTicketViewForOpening = () => {
    offerToOpenTicket(ticket.id);
  };

  const handleClickOpenSendTicketView = () => {
    offerToSendTicket(ticket.id);
  };

  return (
    <>
      <Ticket className={styles.ticketDialogTicket} ticket={ticket} disabled />
      <div className={styles.ticketDialogActions}>
        <TicketDialogButton onClick={handleClickOpenTicketViewForOpening}>
          Open ticket
        </TicketDialogButton>
        <TicketDialogButton onClick={handleClickOpenSendTicketView}>
          Send ticket
        </TicketDialogButton>
      </div>
    </>
  );
};

export default TicketDialogShowing;
