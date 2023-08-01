import Ticket from "~/lottery/components/Ticket/Ticket";
import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";
import Dialog from "~/ui/Dialog/Dialog";
import styles from "./styles.module.css";
import { DialogProps } from "~/ui/Dialog/useDialog";

export type SpecificTicketSelectorDialogProps = {
  ticketsToChoose: LotteryTicket[];
};

type Props = DialogProps &
  SpecificTicketSelectorDialogProps & {
    onClickTicket: (ticketId: LotteryTicketId) => void;
  };

const TicketSelectorDialog = ({
  ticketsToChoose,
  onClickTicket,
  ...dialogProps
}: Props): JSX.Element => {
  const handleClickTicket = (ticketId: LotteryTicketId) => () => {
    onClickTicket(ticketId);
  };

  return (
    <Dialog {...dialogProps}>
      <ul className={styles.tickets}>
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
