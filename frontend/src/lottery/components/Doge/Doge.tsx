import dogeImage from "@/assets/doge.png";
import CSSTransition, {
  CSSTransitionClassNames
} from "react-transition-group/CSSTransition";
import styles from "./styles.module.css";
import {
  LOTTERY_PAGE_CONNECTION_STATUS,
  LotteryPageState
} from "~/lottery/declarations/page";

type Props = {
  state: LotteryPageState;
};

const CLASSES: CSSTransitionClassNames = {
  appear: styles.appear,
  appearActive: styles.appearActive,
  appearDone: styles.appearDone,
  enter: styles.appear,
  enterActive: styles.appearActive,
  enterDone: styles.appearDone,
  exit: styles.exit,
  exitActive: styles.exitActive,
  exitDone: styles.exitDone
};

const DOGE_APPEAR_ANIMATION_TIMEOUT = 1000;

const Doge = ({ state }: Props): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <CSSTransition
        appear
        in={
          state.connectionStatus === LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED &&
          state.transition.shown
        }
        classNames={CLASSES}
        timeout={DOGE_APPEAR_ANIMATION_TIMEOUT}
      >
        <img src={dogeImage.src} className={styles.image} alt="doge" />
      </CSSTransition>
    </div>
  );
};

export default Doge;
