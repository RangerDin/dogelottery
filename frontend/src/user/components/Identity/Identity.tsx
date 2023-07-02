import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";
import { copyTextToClipboard } from "~/ui/clipboard/copyTextToClipboard";
import { forwardRef } from "react";

type Props = {
  address?: string;
  className?: string;
};

const Identity = forwardRef<HTMLDivElement, Props>(
  ({ address, className }: Props, ref): JSX.Element => {
    const handleClickCopyAddress = () => {
      if (address) {
        copyTextToClipboard(address);
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
