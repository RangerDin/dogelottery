import { useCallback } from "react";
import { metamask } from "~/web3/connectors/metamask";
import styles from "./styles.module.css";

type Props = {
  connected: boolean;
  className?: string;
  disabled?: boolean;
};

const ConnectButton = ({
  connected,
  className,
  disabled
}: Props): JSX.Element => {
  const handleClick = useCallback(() => {
    if (connected) {
      metamask.resetState();
    } else {
      metamask.activate();
    }
  }, [connected]);

  return (
    <button
      className={`${className} ${styles.button}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
  );
};

export default ConnectButton;
