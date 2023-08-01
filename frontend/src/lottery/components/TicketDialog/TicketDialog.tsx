import TicketDialogOpening from "~/lottery/components/TicketDialog/TicketDialogOpening";
import TicketDialogShowing from "~/lottery/components/TicketDialog/TicketDialogShowing";
import {
  LotteryTicket,
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import Dialog from "~/ui/Dialog";
import styles from "./styles.module.css";
import TicketDialogSending from "~/lottery/components/TicketDialog/TicketDialogSending";
import {
  SpecificTicketDialogProps,
  TICKET_DIALOG_STATUS
} from "./declarations";
import { DialogProps } from "~/ui/Dialog/useDialog";
import Ticket from "~/lottery/components/Ticket";
import { useState } from "react";

type Props = DialogProps &
  SpecificTicketDialogProps & {
    ticket: LotteryTicket;
    handlers: LotteryPageHandlers;
  };

const TicketDialog = ({
  ticketId,
  ticket,
  handlers,
  onClose,
  ...dialogProps
}: Props): JSX.Element | null => {
  const [status, setStatus] = useState(TICKET_DIALOG_STATUS.VIEW_TICKET);

  const handleClickSlot = async (slot: LotteryTicketSlot) => {
    await handlers.openTicket(ticketId, slot);

    setStatus(TICKET_DIALOG_STATUS.VIEW_TICKET);
  };

  const handleOpenSendTicketView = () => {
    setStatus(TICKET_DIALOG_STATUS.SEND_TICKET);
  };

  const handleOpenTicketView = () => {
    setStatus(TICKET_DIALOG_STATUS.OPEN_TICKET);
  };

  const handleClickCancel = () => {
    setStatus(TICKET_DIALOG_STATUS.VIEW_TICKET);
  };

  const handleClickSendTicket = async (address: string): Promise<void> => {
    await handlers.sendTicket(ticket.id, address);
    onClose();
  };

  const disabledTicket =
    ticket.status === LotteryTicketStatus.OPENING ||
    status === TICKET_DIALOG_STATUS.VIEW_TICKET ||
    status === TICKET_DIALOG_STATUS.SEND_TICKET;

  const sending =
    ticket.status === LotteryTicketStatus.SENDING_NEW ||
    ticket.status === LotteryTicketStatus.SENDING_OPENED;

  return (
    <Dialog {...dialogProps} onClose={onClose}>
      <div className={styles.ticketDialogContent}>
        <Ticket
          className={styles.ticketDialogTicket}
          ticket={ticket}
          disabled={disabledTicket}
          onClickSlot={handleClickSlot}
        />
        {status === TICKET_DIALOG_STATUS.VIEW_TICKET && (
          <TicketDialogShowing
            ticket={ticket}
            onOpenSendTicketView={handleOpenSendTicketView}
            onOpenTicketView={handleOpenTicketView}
          />
        )}
        {(status === TICKET_DIALOG_STATUS.OPEN_TICKET ||
          ticket.status === LotteryTicketStatus.OPENING) && (
          <TicketDialogOpening
            onClickCancel={handleClickCancel}
            opening={ticket.status === LotteryTicketStatus.OPENING}
          />
        )}
        {(status === TICKET_DIALOG_STATUS.SEND_TICKET || sending) && (
          <TicketDialogSending
            sending={sending}
            onClickCancel={handleClickCancel}
            onClickSendTicket={handleClickSendTicket}
          />
        )}
      </div>
    </Dialog>
  );
};

export default TicketDialog;
