import KioskBase from "~/lottery/components/Kiosk/KioskBase/KioskBase";
import KioskTickets from "~/lottery/components/Kiosk/KioskConnected/KioskTickets";
import { CONNECTED_LOTTERY_PAGE_STATUS } from "~/lottery/declarations/state";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";
import KioskBuyTicketButton from "~/lottery/components/Kiosk/KioskBuyTicketButton";
import Doge from "~/lottery/components/Doge";
import {
  LOTTERY_PAGE_CONNECTION_STATUS,
  LotteryPageState
} from "~/lottery/declarations/page";

type Props = {
  state: Extract<
    LotteryPageState,
    {
      connectionStatus: Exclude<
        LOTTERY_PAGE_CONNECTION_STATUS,
        LOTTERY_PAGE_CONNECTION_STATUS.DISCONNECTED
      >;
    }
  >;
  handlers: LotteryPageHandlers;
};

const KioskConnected = ({ state, handlers }: Props): JSX.Element => {
  return (
    <KioskBase
      windowSlot={<Doge />}
      ticketBoardSlot={
        state.connectionStatus === LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED && (
          <KioskTickets
            tickets={state.tickets}
            onClickTicket={handlers.selectTicket}
          />
        )
      }
      actionsSlot={
        <>
          {state.connectionStatus ===
            LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS && (
              <div>Preparing tickets</div>
            )}
          {state.connectionStatus ===
            LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET && (
              <KioskBuyTicketButton onClick={handlers.prepareNewTickets} />
            )}
        </>
      }
    />
  );
};

export default KioskConnected;
