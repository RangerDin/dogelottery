import { toast } from "react-hot-toast";
import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";
import { copyTextToClipboard } from "~/ui/clipboard/copyTextToClipboard";
import { CSSProperties, forwardRef } from "react";

type Props = {
  address?: string;
  className?: string;
};

const COPIED_TOAST_STYLES: CSSProperties = {
  color: "#fff",
  background: "#6b6bc4"
};

const Identity = forwardRef<HTMLDivElement, Props>(
  ({ address, className }: Props, ref): JSX.Element => {
    const handleClickCopyAddress = async () => {
      if (address) {
        await copyTextToClipboard(address);

        toast("Address copied", {
          style: COPIED_TOAST_STYLES
        });
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
