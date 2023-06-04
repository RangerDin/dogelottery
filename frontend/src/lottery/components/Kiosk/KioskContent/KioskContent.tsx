import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  LotteryPageConnectedState,
  LotteryPageDisconnectedState
} from "~/lottery/declarations/state";
import { LotteryTicketId } from "~/lottery/declarations/ticket";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  state: LotteryPageDisconnectedState | LotteryPageConnectedState;
  handlers: LotteryPageHandlers;
};

const KioskContent = ({
  state,
  handlers: { prepareNewTickets, buyAndSelectNewTicket }
}: Props): JSX.Element => {
  const handleClickTicket = (ticketId: LotteryTicketId) => () => {
    buyAndSelectNewTicket(ticketId);
  };

  return (
    <div>
      Kiosk
      {state.connected &&
        state.status ===
          CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET && (
          <button onClick={prepareNewTickets}>buy ticket</button>
        )}
      {state.connected &&
        state.status === CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS && (
          <div>Preparing tickets</div>
        )}
      {state.connected &&
        state.status === CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET && (
          <ul>
            {state.ticketsToChoose.map(ticket => (
              <li key={ticket.id}>
                <button onClick={handleClickTicket(ticket.id)}>
                  Ticket #{ticket.id}
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};

export default KioskContent;
