import { useCallback } from "react";
import { metamask } from "~/web3/connectors/metamask";
import styles from "./styles.module.css";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  connected: boolean;
  className?: string;
  disabled?: boolean;
  handlers: LotteryPageHandlers;
};

const ConnectButton = ({
  connected,
  className,
  disabled,
  handlers
}: Props): JSX.Element => {
  const handlerClick = () => {
    if (connected) {
      handlers.disconnect();
      handlers.onDisconnected();
    } else {
      handlers.connect();
      handlers.onConnected();
    }
  };

  return (
    <button
      className={`${className} ${styles.button}`}
      disabled={disabled}
      onClick={handlerClick}
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
  );
};

export default ConnectButton;
