import TicketDialogOpening from "~/lottery/components/TicketDialog/TicketDialogOpening";
import TicketDialogShowing from "~/lottery/components/TicketDialog/TicketDialogShowing";
import { CONNECTED_LOTTERY_PAGE_STATUS } from "~/lottery/declarations/state";
import { LotteryTicket } from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import Dialog from "~/ui/Dialog";
import styles from "./styles.module.css";
import TicketDialogSending from "~/lottery/components/TicketDialog/TicketDialogSending";
import { PageStatusForLotteryTicketDialog } from "~/lottery/components/TicketDialog/declarations";

type Props = {
  open: boolean;
  ticket: LotteryTicket;
  status: PageStatusForLotteryTicketDialog;
  handlers: LotteryPageHandlers;
};

const TicketDialog = ({
  open,
  ticket,
  status,
  handlers
}: Props): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handlers.closeTicket}>
      <div className={styles.ticketDialogContent}>
        {status === CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET && (
          <TicketDialogShowing ticket={ticket} handlers={handlers} />
        )}
        {(status === CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET ||
          status === CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET) && (
          <TicketDialogOpening
            ticket={ticket}
            handlers={handlers}
            opening={status === CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET}
          />
        )}
        {(status === CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET ||
          status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET) && (
          <TicketDialogSending
            ticket={ticket}
            handlers={handlers}
            sending={status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET}
          />
        )}
      </div>
    </Dialog>
  );
};

export default TicketDialog;
