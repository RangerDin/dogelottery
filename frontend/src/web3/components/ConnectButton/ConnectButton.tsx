import { useCallback } from "react";
import { metamask } from "~/web3/connectors/metamask";

type Props = {
  className?: string;
  disabled?: boolean;
};

const ConnectButton = ({ className, disabled }: Props): JSX.Element => {
  const handleClick = useCallback(() => {
    metamask.activate();
  }, []);

  return (
    <button className={className} disabled={disabled} onClick={handleClick}>
      Connect
    </button>
  );
};

export default ConnectButton;
