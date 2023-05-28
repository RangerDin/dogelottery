import { useCallback } from "react";
import { metamask } from "~/web3/connectors/metamask";

type Props = {
  className?: string;
};

const ConnectButton = ({ className }: Props): JSX.Element => {
  const handleClick = useCallback(() => {
    metamask.activate();
  }, []);

  return (
    <button className={className} onClick={handleClick}>
      Connect
    </button>
  );
};

export default ConnectButton;
