import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";
import { copyTextToClipboard } from "~/ui/clipboard/copyTextToClipboard";

type Props = {
  address?: string;
};

const Identity = ({ address }: Props): JSX.Element => {
  const handleClickCopyAddress = () => {
    if (address) {
      copyTextToClipboard(address);
    }
  };

  return (
    <div className={styles.identity}>
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
};

export default Identity;
