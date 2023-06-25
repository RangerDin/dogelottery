import styles from "./styles.module.css";

const TICKETS_TO_SHOW = 4;

const KioskSkeletonTickets = (): JSX.Element => {
  return (
    <>
      {new Array(TICKETS_TO_SHOW).fill(0).map((_, index) => (
        <div key={index} className={styles.ticket} />
      ))}
    </>
  );
};

export default KioskSkeletonTickets;
