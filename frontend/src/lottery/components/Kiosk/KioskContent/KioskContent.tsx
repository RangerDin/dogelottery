import TicketList from "~/lottery/components/TicketList";
import TicketSelectorDialog from "~/lottery/components/TicketSelectorDialog";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  LotteryPageConnectedState,
  LotteryPageDisconnectedState
} from "~/lottery/declarations/state";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  state: LotteryPageDisconnectedState | LotteryPageConnectedState;
  handlers: LotteryPageHandlers;
};

const KioskContent = ({ state, handlers }: Props): JSX.Element => {
  const handleCloseTicketSelectorDialog = () => {
    handlers.cancelTicketsSelection();
  };

  return (
    <>
      <div>
        Kiosk
        {state.connected &&
          state.status ===
            CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET && (
            <button onClick={handlers.prepareNewTickets}>buy ticket</button>
          )}
        {state.connected &&
          state.status === CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS && (
            <div>Preparing tickets</div>
          )}
        {!state.checkingConnection && state.connected && (
          <TicketList
            tickets={state.tickets}
            onClickTicket={handlers.selectTicket}
          />
        )}
      </div>
      {state.connected && state.ticketSelectionDialog.mounted && (
        <TicketSelectorDialog
          {...state.ticketSelectionDialog.dialogProps}
          onClose={handleCloseTicketSelectorDialog}
          {...state.ticketSelectionDialog.payload}
          onClickTicket={handlers.buyAndSelectNewTicket}
        />
      )}
    </>
  );
};

export default KioskContent;
