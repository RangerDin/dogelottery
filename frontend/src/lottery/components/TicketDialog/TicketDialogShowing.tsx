import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import TicketDialogButton from "./TicketDialogButton";
import styles from "./styles.module.css";

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
