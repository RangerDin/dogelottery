import Kiosk from "~/lottery/components/Kiosk";
import Identity from "~/user/components/Identity";
import ConnectButton from "~/web3/components/ConnectButton";
import styles from "./styles.module.css";
import useLotteryPageState from "~/lottery/useLotteryPageState";
import TicketDialog from "~/lottery/components/TicketDialog";
import { LOTTERY_PAGE_CONNECTION_STATUS } from "~/lottery/declarations/page";
import Fade from "~/ui/animation/Fade";

export const Home = () => {
  const { state, handlers } = useLotteryPageState();

  return (
    <main className={styles.page}>
      <div className={styles.identity}>
        {state.connectionStatus ===
          LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED && (
          <Fade
            in={state.connection.in}
            onEntered={handlers.onConnected}
            onExited={handlers.onDisconnected}
            mountOnEnter
            unmountOnExit
          >
            <Identity address={state.address} />
          </Fade>
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
              LOTTERY_PAGE_CONNECTION_STATUS.CONNECTING
            }
            handlers={handlers}
          />
        )}
      </div>
      <div className={styles.mainContent}>
        <Kiosk className={styles.kiosk} state={state} handlers={handlers} />
        {state.connectionStatus === LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
          state.ticketDialog.mounted &&
          state.activeTicket && (
            <TicketDialog
              {...state.ticketDialog.dialogProps}
              {...state.ticketDialog.payload}
              ticket={state.activeTicket}
              handlers={handlers}
            />
          )}
      </div>
    </main>
  );
};
