import Ticket from "~/lottery/components/Ticket/Ticket";
import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";
import Dialog from "~/ui/Dialog/Dialog";
import styles from "./styles.module.css";
import { DialogProps } from "~/ui/Dialog/useDialog";
import { MutableLotteryPageTicketPurchaseState } from "~/lottery/declarations/state";

export type SpecificTicketSelectorDialogProps = {
  ticketsToChoose: LotteryTicket[];
};

type Props = DialogProps &
  SpecificTicketSelectorDialogProps & {
    ticketPurchaseState: MutableLotteryPageTicketPurchaseState;
    onClickTicket: (ticketId: LotteryTicketId) => void;
  };

const TicketSelectorDialog = ({
  ticketsToChoose,
  ticketPurchaseState,
  onClickTicket,
  ...dialogProps
}: Props): JSX.Element => {
  const handleClickTicket = (ticketId: LotteryTicketId) => () => {
    if (!ticketPurchaseState.inProgress) {
      onClickTicket(ticketId);
    }
  };

  const handleClose = () => {
    if (!ticketPurchaseState.inProgress) {
      dialogProps.onClose();
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <ul
        className={`${styles.tickets} ${
          ticketPurchaseState.inProgress && styles.ticketsBlocked
        }`}
      >
        {ticketsToChoose.map(ticket => (
          <li
            key={ticket.id}
            className={styles.ticketWrapper}
            onClick={handleClickTicket(ticket.id)}
          >
            <Ticket className={styles.ticket} ticket={ticket} disabled />
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

export default TicketSelectorDialog;
