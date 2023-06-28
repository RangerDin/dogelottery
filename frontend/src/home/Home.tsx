import Kiosk from "~/lottery/components/Kiosk";
import Identity from "~/user/components/Identity";
import ConnectButton from "~/web3/components/ConnectButton";
import styles from "./styles.module.css";
import useLotteryPageState from "~/lottery/useLotteryPageState";
import TicketDialog from "~/lottery/components/TicketDialog";
import { CONNECTED_LOTTERY_PAGE_STATUS } from "~/lottery/declarations/state";
import { LOTTERY_PAGE_CONNECTION_STATUS } from "~/lottery/declarations/page";

export const Home = () => {
  const { state, handlers } = useLotteryPageState();

  return (
    <main className={styles.page}>
      <div className={styles.identity}>
        {state.connectionStatus ===
          LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED && (
          <Identity address={state.address} />
        )}
        {state.connectionStatus !==
          LOTTERY_PAGE_CONNECTION_STATUS.CHECKING_CONNECTION && (
          <ConnectButton
            connected={
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED ||
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTING
            }
            disabled={
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.CONNECTING ||
              state.connectionStatus ===
                LOTTERY_PAGE_CONNECTION_STATUS.DISCONNECTING
            }
            handlers={handlers}
          />
        )}
      </div>
      <div className={styles.mainContent}>
        <Kiosk className={styles.kiosk} state={state} handlers={handlers} />
        {state.connectionStatus === LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
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
