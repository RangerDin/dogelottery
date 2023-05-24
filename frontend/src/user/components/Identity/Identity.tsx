import Logo from "~/user/components/Logo";
import styles from "./styles.module.css";

type Props = {};

const Identity = (props: Props): JSX.Element => {
  return (
    <div className={styles.identity}>
      <Logo />
      Identity
    </div>
  );
};

export default Identity;
