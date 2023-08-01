import Ticket from "~/lottery/components/Ticket";
import TicketDialogButton from "./TicketDialogButton";
import {
  LotteryTicket,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import styles from "./styles.module.css";

type Props = {
  opening: boolean;
  onClickCancel: () => void;
};

const TicketDialogOpening = ({
  opening,
  onClickCancel
}: Props): JSX.Element | null => {
  return (
    <>
      <div className={styles.ticketDialogActions}>
        <TicketDialogButton disabled={opening} onClick={onClickCancel}>
          Cancel
        </TicketDialogButton>
      </div>
      <div>To open ticket click on one of the slots</div>
    </>
  );
};

export default TicketDialogOpening;
