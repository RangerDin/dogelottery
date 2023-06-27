import dogeImage from "@/assets/doge.png";
import styles from "./styles.module.css";

type Props = {};

const Doge = (props: Props): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <img src={dogeImage.src} className={styles.image} alt="doge" />
    </div>
  );
};

export default Doge;
