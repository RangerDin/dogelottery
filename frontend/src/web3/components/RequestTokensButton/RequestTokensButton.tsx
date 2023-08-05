import { hooks } from "~/web3/connectors/metamask";
import Button from "~/ui/Button";
import wrapWeb3Errors from "~/web3/errors/wrapWeb3Errors";
import { requestTokens } from "~/web3/dogeToken/requestTokens";
import useToast from "~/ui/toasts/useToast";
import { forwardRef, useState } from "react";
import useWeb3ErrorsHandler from "~/web3/errors/useWeb3ErrorsHandler";
import styles from "./styles.module.css";

type Props = {
  className?: string;
};

const { useProvider } = hooks;

const RequestTokensButton = forwardRef<HTMLButtonElement, Props>(
  ({ className }: Props, ref): JSX.Element => {
    const provider = useProvider();
    const { toast } = useToast();
    const handleWeb3Error = useWeb3ErrorsHandler();

    const [inProcess, setInProcess] = useState(false);

    const handlerClick = () =>
      handleWeb3Error(async () => {
        try {
          if (!provider) {
            throw new Error("No provider");
          }

          setInProcess(true);

          await wrapWeb3Errors(() => requestTokens(provider));

          toast("Tokens successfully received");
        } finally {
          setInProcess(false);
        }
      });

    return (
      <Button
        ref={ref}
        className={`${className} ${styles.requestTokensButton}`}
        disabled={inProcess}
        onClick={handlerClick}
      >
        Request Tokens
      </Button>
    );
  }
);

RequestTokensButton.displayName = "RequestTokensButton";

export default RequestTokensButton;
