import styles from "./styles.module.css";
import { isAddress } from "@ethersproject/address";
import { ChangeEventHandler, useState } from "react";
import Ticket from "~/lottery/components/Ticket";
import TicketDialogButton from "~/lottery/components/TicketDialog/TicketDialogButton";
import { LotteryTicket } from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  ticket: LotteryTicket;
  handlers: LotteryPageHandlers;
  sending: boolean;
};

const TicketDialogSending = ({
  ticket,
  handlers: { sendTicket, cancelSendingTicket },
  sending
}: Props): JSX.Element | null => {
  const [address, setAddress] = useState("");

  const handleChangeAddress: ChangeEventHandler<HTMLInputElement> = event => {
    const address = event.target.value;

    setAddress(address);
  };

  const handleClickSendTicket = () => {
    sendTicket(ticket.id, address);
  };

  return (
    <>
      <Ticket className={styles.ticketDialogTicket} disabled ticket={ticket} />
      <input
        className={styles.ticketDialogAddress}
        value={address}
        placeholder="Address"
        onChange={handleChangeAddress}
      />
      <div className={styles.ticketDialogActions}>
        <TicketDialogButton disabled={sending} onClick={cancelSendingTicket}>
          cancel
        </TicketDialogButton>
        <TicketDialogButton
          disabled={sending || !isAddress(address)}
          onClick={handleClickSendTicket}
        >
          Send ticket
        </TicketDialogButton>
      </div>
    </>
  );
};

export default TicketDialogSending;
