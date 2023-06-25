import { useCallback } from "react";
import { metamask } from "~/web3/connectors/metamask";
import styles from "./styles.module.css";

type Props = {
  className?: string;
  disabled?: boolean;
};

const ConnectButton = ({ className, disabled }: Props): JSX.Element => {
  const handleClick = useCallback(() => {
    metamask.activate();
  }, []);

  return (
    <button
      className={`${className} ${styles.connectButton}`}
      disabled={disabled}
      onClick={handleClick}
    >
      Connect
    </button>
  );
};

export default ConnectButton;
