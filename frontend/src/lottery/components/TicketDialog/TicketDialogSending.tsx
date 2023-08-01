import styles from "./styles.module.css";
import { isAddress } from "@ethersproject/address";
import { ChangeEventHandler, useState } from "react";
import TicketDialogButton from "~/lottery/components/TicketDialog/TicketDialogButton";
import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";
import Hint from "~/ui/Hint";

type Props = {
  sending: boolean;
  onClickCancel: () => void;
  onClickSendTicket: (address: string) => void;
};

const TicketDialogSending = ({
  sending,
  onClickCancel,
  onClickSendTicket
}: Props): JSX.Element | null => {
  const [address, setAddress] = useState("");

  const handleChangeAddress: ChangeEventHandler<HTMLInputElement> = event => {
    const address = event.target.value;

    setAddress(address);
  };

  const handleClickSendTicket = () => {
    onClickSendTicket(address);
  };

  return (
    <>
      <input
        className={styles.ticketDialogAddress}
        value={address}
        placeholder="Address"
        onChange={handleChangeAddress}
      />
      <div className={styles.ticketDialogActions}>
        <TicketDialogButton disabled={sending} onClick={onClickCancel}>
          Cancel
        </TicketDialogButton>
        <TicketDialogButton
          disabled={sending || !isAddress(address)}
          onClick={handleClickSendTicket}
        >
          Send ticket
        </TicketDialogButton>
      </div>
      <Hint in={sending}>The ticket is being sent...</Hint>
    </>
  );
};

export default TicketDialogSending;
