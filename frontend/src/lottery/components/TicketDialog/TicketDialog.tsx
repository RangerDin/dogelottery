import { isAddress } from "@ethersproject/address";
import { ChangeEventHandler, useState } from "react";
import Ticket from "~/lottery/components/Ticket";
import {
  LotteryTicket,
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";

type Props = {
  open: boolean;
  ticket: LotteryTicket;
  sendTicketView: boolean;
  sendingTicket: boolean;
  onClose: () => void;
  onClickCancel: () => void;
  onClickSendTicket: (
    ticketId: LotteryTicketId,
    newOwnerAddress: string
  ) => void;
  onClickOpenSendTicketView: (ticketId: LotteryTicketId) => void;
  onClickTicketSlot: (
    ticketId: LotteryTicketId,
    slot: LotteryTicketSlot
  ) => void;
};

const TicketDialog = ({
  open,
  ticket,
  sendTicketView,
  sendingTicket,
  onClose,
  onClickCancel,
  onClickSendTicket,
  onClickOpenSendTicketView,
  onClickTicketSlot
}: Props): JSX.Element | null => {
  const [address, setAddress] = useState("");

  const handleClickOpenSendTicketView = () => {
    onClickOpenSendTicketView(ticket.id);
  };

  const handleClickSlot = (slot: LotteryTicketSlot) => {
    onClickTicketSlot(ticket.id, slot);
  };

  const handleChangeAddress: ChangeEventHandler<HTMLInputElement> = event => {
    const address = event.target.value;

    setAddress(address);
  };

  const handleClickSendTicket = () => {
    onClickSendTicket(ticket.id, address);
  };

  if (!open) {
    return null;
  }

  return (
    <div>
      <Ticket ticket={ticket} onClickSlot={handleClickSlot} />
      <button onClick={onClose}>close</button>
      {sendTicketView && (
        <>
          <input value={address} onChange={handleChangeAddress} />
          <button
            disabled={sendingTicket || !isAddress(address)}
            onClick={handleClickSendTicket}
          >
            Send ticket
          </button>
          <button onClick={onClickCancel}>cancel</button>
        </>
      )}
      {!sendTicketView && (
        <button onClick={handleClickOpenSendTicketView}>
          Open send ticket view
        </button>
      )}
    </div>
  );
};

export default TicketDialog;
