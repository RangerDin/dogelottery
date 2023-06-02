import Kiosk from "~/lottery/components/Kiosk";
import TicketList from "~/lottery/components/TicketList";
import Identity from "~/user/components/Identity";
import ConnectButton from "~/web3/components/ConnectButton";
import styles from "./styles.module.css";
import useLotteryPageState from "~/lottery/useLotteryPageState";

export const Home = () => {
  const { state } = useLotteryPageState();

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
        <Kiosk className={styles.kiosk} />
        {!state.checkingConnection && state.connected && (
          <TicketList className={styles.ticketList} />
        )}
      </div>
    </main>
  );
};
