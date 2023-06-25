import styles from "./styles.module.css";

type Props = {
  disabled?: boolean;
  onClick?: () => void;
};

const KioskBuyTicketButton = ({ disabled, onClick }: Props): JSX.Element => {
  return (
    <button
      disabled={disabled}
      className={styles.buyTicketButton}
      onClick={onClick}
    >
      Buy ticket
    </button>
  );
};

export default KioskBuyTicketButton;
