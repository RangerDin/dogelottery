import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  windowSlot: ReactNode;
  ticketBoardSlot: ReactNode;
  actionsSlot: ReactNode;
};

const KioskBase = ({
  windowSlot,
  ticketBoardSlot,
  actionsSlot
}: Props): JSX.Element => {
  return (
    <div className={styles.kiosk}>
      <div className={styles.roof} />
      <div className={styles.frame}>
        <div className={styles.window}>{windowSlot}</div>
        <section className={styles.ticketsBoard}>
          <h3 className={styles.ticketsBoardTitle}>Tickets</h3>
          <div className={styles.ticketsBoardContent}>{ticketBoardSlot}</div>
        </section>
        <div className={styles.actions}>{actionsSlot}</div>
        <div className={styles.door} />
        <div className={styles.windowsill} />
      </div>
    </div>
  );
};

export default KioskBase;
