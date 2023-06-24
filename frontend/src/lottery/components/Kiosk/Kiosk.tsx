import KioskConnected from "~/lottery/components/Kiosk/KioskConnected";
import KioskSkeleton from "~/lottery/components/Kiosk/KioskSkeleton";
import TicketSelectorDialog from "~/lottery/components/TicketSelectorDialog";
import { LotteryPageState } from "~/lottery/declarations/state";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  className?: string;
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const Kiosk = ({ className, state, handlers }: Props): JSX.Element => {
  const handleCloseTicketSelectorDialog = () => {
    handlers.cancelTicketsSelection();
  };

  return (
    <section className={className}>
      {state.checkingConnection ? (
        <KioskSkeleton />
      ) : (
        <>
          <KioskConnected state={state} handlers={handlers} />
          {state.connected && state.ticketSelectionDialog.mounted && (
            <TicketSelectorDialog
              {...state.ticketSelectionDialog.dialogProps}
              onClose={handleCloseTicketSelectorDialog}
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
