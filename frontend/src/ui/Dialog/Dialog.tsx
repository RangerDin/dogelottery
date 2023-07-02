import {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";
import CSSTransition from "react-transition-group/CSSTransition";
import Fade from "~/ui/animation/Fade/Fade";

type Props = {
  open: boolean;
  children?: ReactNode;
  onClose: () => void;
  onExited: () => void;
};

const APPEAR_ANIMATION_TIMEOUT = 300;

const Dialog = ({
  open,
  children,
  onClose,
  onExited
}: Props): JSX.Element | null => {
  const [addStartAnimation, setAddStartAnimation] = useState(false);

  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAddStartAnimation(true);
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  const handleClickBackdrop: MouseEventHandler<HTMLElement> = event => {
    const dialogContent = dialogContentRef.current;

    if (!dialogContent) {
      return;
    }

    const target = event.target as Element;

    if (!dialogContent.contains(target) || dialogContent === target) {
      onClose();
    }
  };

  const handleExited = () => {
    setAddStartAnimation(false);
    onExited();
  };

  const dialogContent = (
    <Fade
      in={open}
      timeout={APPEAR_ANIMATION_TIMEOUT}
      onExited={handleExited}
      mountOnEnter
      unmountOnExit
    >
      <div className={styles.dialog} onClick={handleClickBackdrop}>
        <button className={styles.dialogCloseButton} />
        <div ref={dialogContentRef} className={styles.dialogContent}>
          {children}
        </div>
      </div>
    </Fade>
  );

  return createPortal(dialogContent, document.body);
};

export default Dialog;
