import KioskBase from "~/lottery/components/Kiosk/KioskBase";

type Props = {};

const KioskSkeleton = (props: Props): JSX.Element => {
  return (
    <KioskBase
      actionsSlot={<div>Kiosk loading...</div>}
      ticketBoardSlot={<></>}
      windowSlot={<></>}
    />
  );
};

export default KioskSkeleton;
