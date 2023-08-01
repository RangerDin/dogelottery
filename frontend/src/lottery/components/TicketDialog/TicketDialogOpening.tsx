import TicketDialogButton from "./TicketDialogButton";
import styles from "./styles.module.css";
import Hint from "~/ui/Hint";

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
      <Hint in={opening}>The ticket is opening...</Hint>
      <Hint in={!opening}>Pick one of the slots to open the ticket</Hint>
    </>
  );
};

export default TicketDialogOpening;
