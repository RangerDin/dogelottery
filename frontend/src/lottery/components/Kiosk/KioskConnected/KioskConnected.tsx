import KioskBase from "~/lottery/components/Kiosk/KioskBase/KioskBase";
import KioskTickets from "~/lottery/components/Kiosk/KioskConnected/KioskTickets";
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
        <Fade
          in={
            state.connectionStatus ===
              LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED && state.connection.in
          }
          mountOnEnter
          unmountOnExit
          withAbsolutePosition
        >
          <KioskBuyTicketButton
            disabled={
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
              state.ticketPreparing.inProgress
            }
            onClick={handlers.prepareNewTickets}
          />
        </Fade>
      }
    />
  );
};

export default KioskConnected;
