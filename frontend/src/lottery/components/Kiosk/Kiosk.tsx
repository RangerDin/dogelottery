import KioskConnected from "~/lottery/components/Kiosk/KioskConnected";
import KioskSkeleton from "~/lottery/components/Kiosk/KioskSkeleton";
import TicketSelectorDialog from "~/lottery/components/TicketSelectorDialog";
import {
  LOTTERY_PAGE_CONNECTION_STATUS,
  LotteryPageState
} from "~/lottery/declarations/page";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  className?: string;
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const Kiosk = ({ className, state, handlers }: Props): JSX.Element => {
  return (
    <section className={className}>
      {state.connectionStatus ===
      LOTTERY_PAGE_CONNECTION_STATUS.CHECKING_CONNECTION ? (
        <KioskSkeleton />
      ) : (
        <>
          <KioskConnected state={state} handlers={handlers} />
          {state.connectionStatus ===
            LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
            state.ticketSelectionDialog.mounted && (
              <TicketSelectorDialog
                {...state.ticketSelectionDialog.dialogProps}
                {...state.ticketSelectionDialog.payload}
                onClickTicket={handlers.buyAndSelectNewTicket}
              />
            )}
        </>
      )}
    </section>
  );
};

export default Kiosk;
