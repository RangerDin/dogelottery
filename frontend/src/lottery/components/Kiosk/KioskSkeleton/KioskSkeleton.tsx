import KioskBase from "~/lottery/components/Kiosk/KioskBase";
import KioskSkeletonTickets from "./KioskSkeletonTickets";

type Props = {};

const KioskSkeleton = (props: Props): JSX.Element => {
  return (
    <KioskBase
      actionsSlot={<div>Kiosk loading...</div>}
      ticketBoardSlot={<KioskSkeletonTickets />}
      windowSlot={<></>}
    />
  );
};

export default KioskSkeleton;
