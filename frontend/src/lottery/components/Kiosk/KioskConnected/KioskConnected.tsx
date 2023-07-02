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
import Fade from "~/ui/animation/Fade/Fade";

type Props = {
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const KioskConnected = ({ state, handlers }: Props): JSX.Element => {
  return (
    <KioskBase
      windowSlot={<Doge state={state} />}
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
          <Fade
            in={
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
              state.status === CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS
            }
            mountOnEnter
            unmountOnExit
          >
            <div>Preparing tickets</div>
          </Fade>
          <Fade
            in={
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
              state.status ===
                CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET &&
              state.transition.shown
            }
            mountOnEnter
            unmountOnExit
          >
            <KioskBuyTicketButton onClick={handlers.prepareNewTickets} />
          </Fade>
        </>
      }
    />
  );
};

export default KioskConnected;
