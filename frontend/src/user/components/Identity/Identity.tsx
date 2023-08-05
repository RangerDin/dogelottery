import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";
import { copyTextToClipboard } from "~/ui/clipboard/copyTextToClipboard";
import { CSSProperties, forwardRef } from "react";
import useToast from "~/ui/toasts/useToast";

type Props = {
  address?: string;
  className?: string;
};

const Identity = forwardRef<HTMLDivElement, Props>(
  ({ address, className }: Props, ref): JSX.Element => {
    const { toast } = useToast();

    const handleClickCopyAddress = async () => {
      if (address) {
        await copyTextToClipboard(address);

        toast("Address copied");
      }
    };

    return (
      <div ref={ref} className={`${styles.identity} ${className}`}>
        {address && (
          <>
            <Logo address={address} />
            <button
              title={address}
              onClick={handleClickCopyAddress}
              className={styles.identityAddress}
            >
              {address}
            </button>
          </>
        )}
      </div>
    );
  }
);

Identity.displayName = "Identity";

export default Identity;
