import KioskBase from "~/lottery/components/Kiosk/KioskBase";
import KioskSkeletonTickets from "./KioskSkeletonTickets";
import KioskBuyTicketButton from "~/lottery/components/Kiosk/KioskBuyTicketButton";

type Props = {};

const KioskSkeleton = (props: Props): JSX.Element => {
  return (
    <KioskBase
      windowSlot={null}
      actionsSlot={<KioskBuyTicketButton disabled />}
      ticketBoardSlot={<KioskSkeletonTickets />}
    />
  );
};

export default KioskSkeleton;
