import styles from "./styles.module.css";
import { isAddress } from "@ethersproject/address";
import TicketDialogButton from "./TicketDialogButton";
import Hint from "~/ui/Hint";

type Props = {
  sending: boolean;
  disabledSending?: boolean;
  onClickCancel: () => void;
  onClickSendTicket: () => void;
};

const TicketDialogSending = ({
  sending,
  disabledSending,
  onClickCancel,
  onClickSendTicket
}: Props): JSX.Element | null => {
  return (
    <>
      <div className={styles.ticketDialogActions}>
        <TicketDialogButton disabled={sending} onClick={onClickCancel}>
          Cancel
        </TicketDialogButton>
        <TicketDialogButton
          disabled={sending || disabledSending}
          onClick={onClickSendTicket}
        >
          Send ticket
        </TicketDialogButton>
      </div>
      <Hint in={sending}>The ticket is being sent...</Hint>
    </>
  );
};

export default TicketDialogSending;
