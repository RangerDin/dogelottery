import Ticket from "~/lottery/components/Ticket";
import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import styles from "./styles.module.css";
import TicketDialogButton from "~/lottery/components/TicketDialog/TicketDialogButton";

type Props = {
  ticket: LotteryTicket;
  onOpenTicketView: () => void;
  onOpenSendTicketView: () => void;
};

const TicketDialogShowing = ({
  ticket,
  onOpenTicketView,
  onOpenSendTicketView
}: Props): JSX.Element | null => {
  return (
    <div className={styles.ticketDialogActions}>
      {ticket.status === LotteryTicketStatus.NEW && (
        <TicketDialogButton onClick={onOpenTicketView}>
          Open ticket
        </TicketDialogButton>
      )}
      <TicketDialogButton onClick={onOpenSendTicketView}>
        Send ticket
      </TicketDialogButton>
    </div>
  );
};

export default TicketDialogShowing;
