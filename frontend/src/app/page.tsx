"use client";

import Identity from "~/user/components/Identity";
import styles from "./page.module.css";
import Kiosk from "~/lottery/components/Kiosk";
import TicketList from "~/lottery/components/TicketList";
import ConnectButton from "~/web3/ConnectButton";

import useLotteryPageState from "~/lottery/useLotteryPageState";

const Home = () => {
  const { state } = useLotteryPageState();

  return (
    <main className={styles.page}>
      <div className={styles.identity}>
        {!state.connected && <ConnectButton />}
        {state.connected && <Identity />}
      </div>
      <div className={styles.mainContent}>
        <Kiosk className={styles.kiosk} />
        {state.connected === true && (
          <TicketList className={styles.ticketList} />
        )}
      </div>
    </main>
  );
};

export default Home;
