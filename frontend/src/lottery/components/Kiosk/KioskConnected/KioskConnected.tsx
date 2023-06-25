import KioskBase from "~/lottery/components/Kiosk/KioskBase/KioskBase";
import KioskTickets from "~/lottery/components/Kiosk/KioskConnected/KioskTickets";
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

const KioskConnected = ({ state, handlers }: Props): JSX.Element => {
  return (
    <KioskBase
      windowSlot={<div>doge</div>}
      ticketBoardSlot={
        !state.checkingConnection &&
        state.connected && (
          <KioskTickets
            tickets={state.tickets}
            onClickTicket={handlers.selectTicket}
          />
        )
      }
      actionsSlot={
        <>
          {state.connected &&
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS && (
              <div>Preparing tickets</div>
            )}
          {state.connected &&
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET && (
              <button onClick={handlers.prepareNewTickets}>buy ticket</button>
            )}
        </>
      }
    />
  );
};

export default KioskConnected;
