import Button from "~/ui/Button";
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
    } else {
      handlers.connect();
    }
  };

  return (
    <Button className={className} disabled={disabled} onClick={handlerClick}>
      {connected ? "Disconnect" : "Connect"}
    </Button>
  );
};

export default ConnectButton;
