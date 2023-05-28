import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";

type Props = {
  address?: string;
};

const Identity = ({ address }: Props): JSX.Element => {
  if (!address) {
    return <div className={styles.identity}></div>;
  }

  return (
    <div className={styles.identity}>
      {address ? (
        <>
          <Logo />
          {address}
        </>
      ) : (
        "Can't get an address"
      )}
    </div>
  );
};

export default Identity;
