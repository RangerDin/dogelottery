import Kiosk from "~/lottery/components/Kiosk";
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
        {!state.checkingConnection &&
          state.connected &&
          (state.status === CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET ||
            state.status === CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET ||
            state.status === CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET ||
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET ||
            state.status ===
              CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET) && (
            <TicketDialog
              open
              ticket={state.activeTicket}
              status={state.status}
              handlers={handlers}
            />
          )}
      </div>
    </main>
  );
};
