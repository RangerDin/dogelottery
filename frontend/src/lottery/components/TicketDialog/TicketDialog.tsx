import {
  LotteryTicket,
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import Dialog from "~/ui/Dialog";
import styles from "./styles.module.css";
import {
  SpecificTicketDialogProps,
  TICKET_DIALOG_STATUS
} from "./declarations";
import { DialogProps } from "~/ui/Dialog/useDialog";
import Ticket from "~/lottery/components/Ticket";
import { ChangeEventHandler, useState } from "react";
import { isAddress } from "@ethersproject/address";

import TicketDialogInput from "./TicketDialogInput";
import TicketDialogSending from "./TicketDialogSending";
import TicketDialogOpening from "./TicketDialogOpening";
import TicketDialogShowing from "./TicketDialogShowing";

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
  const [address, setAddress] = useState("");

  const sending =
    ticket.status === LotteryTicketStatus.SENDING_NEW ||
    ticket.status === LotteryTicketStatus.SENDING_OPENED;
  const opening = ticket.status === LotteryTicketStatus.OPENING;
  const operationInProgress = sending || opening;
  const disabledTicket =
    operationInProgress ||
    status === TICKET_DIALOG_STATUS.VIEW_TICKET ||
    status === TICKET_DIALOG_STATUS.SEND_TICKET;

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

  const handleClose = () => {
    if (!operationInProgress) {
      onClose();
    }
  };

  const handleClickSendTicket = async (): Promise<void> => {
    await handlers.sendTicket(ticket.id, address);
    handleClose();
  };

  const handleChangeAddress: ChangeEventHandler<HTMLInputElement> = event => {
    const address = event.target.value;

    setAddress(address);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <div className={styles.ticketDialogContent}>
        <Ticket
          className={styles.ticketDialogTicket}
          ticket={ticket}
          disabled={disabledTicket}
          highlightedSlots={status === TICKET_DIALOG_STATUS.OPEN_TICKET}
          onClickSlot={handleClickSlot}
        />
        <TicketDialogInput
          in={status === TICKET_DIALOG_STATUS.SEND_TICKET}
          value={address}
          onChange={handleChangeAddress}
        />
        {status === TICKET_DIALOG_STATUS.VIEW_TICKET && (
          <TicketDialogShowing
            ticket={ticket}
            onOpenSendTicketView={handleOpenSendTicketView}
            onOpenTicketView={handleOpenTicketView}
          />
        )}
        {status === TICKET_DIALOG_STATUS.OPEN_TICKET && (
          <TicketDialogOpening
            onClickCancel={handleClickCancel}
            opening={operationInProgress}
          />
        )}
        {status === TICKET_DIALOG_STATUS.SEND_TICKET && (
          <TicketDialogSending
            sending={sending}
            disabledSending={!isAddress(address)}
            onClickCancel={handleClickCancel}
            onClickSendTicket={handleClickSendTicket}
          />
        )}
      </div>
    </Dialog>
  );
};

export default TicketDialog;
