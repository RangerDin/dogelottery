import Kiosk from "~/lottery/components/Kiosk";
import TicketList from "~/lottery/components/TicketList";
import Identity from "~/user/components/Identity";
import ConnectButton from "~/web3/components/ConnectButton";
import styles from "./styles.module.css";
import useLotteryPageState from "~/lottery/useLotteryPageState";
import TicketDialog from "~/lottery/components/TicketDialog";
import { CONNECTED_LOTTERY_PAGE_STATUS } from "~/lottery/declarations/state";

export const Home = () => {
  const { state, handlers } = useLotteryPageState();

  return (
    <main className={styles.page}>
      <div className={styles.identity}>
        {!state.checkingConnection && (
          <>
            {!state.connected && <ConnectButton disabled={state.connecting} />}
            {state.connected && <Identity address={state.address} />}
          </>
        )}
      </div>
      <div className={styles.mainContent}>
        <Kiosk className={styles.kiosk} state={state} handlers={handlers} />
        {!state.checkingConnection && state.connected && (
          <TicketList
            className={styles.ticketList}
            tickets={state.tickets}
            onClickTicket={handlers.selectTicket}
          />
        )}
        {!state.checkingConnection &&
          state.connected &&
          (state.status === CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET ||
            state.status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET ||
            state.status === CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET ||
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET ||
            state.status === CONNECTED_LOTTERY_PAGE_STATUS.BUYING_TICKET) && (
            <TicketDialog
              open
              ticket={state.activeTicket}
              sendTicketView={
                state.status ===
                  CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET ||
                state.status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET
              }
              sendingTicket={
                state.status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET
              }
              onClose={handlers.closeTicket}
              onClickCancel={handlers.cancelSendingTicket}
              onClickOpenSendTicketView={handlers.offerToSendTicket}
              onClickSendTicket={handlers.sendTicket}
              onClickTicketSlot={handlers.openTicket}
            />
          )}
      </div>
    </main>
  );
};
