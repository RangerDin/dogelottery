import {
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

type Props = {
  slot: LotteryTicketSlot;
  winning: boolean;
  status:
    | LotteryTicketStatus.OPENED
    | LotteryTicketStatus.OPENING
    | LotteryTicketStatus.NEW;
  disabled?: boolean;
  onClick?: () => void;
};

const TicketSlot = ({
  slot,
  winning,
  disabled,
  onClick
}: Props): JSX.Element => {
  return (
    <button disabled={disabled} onClick={onClick}>
      Slot #{slot} {winning && " (winning)"}
    </button>
  );
};

export default TicketSlot;
