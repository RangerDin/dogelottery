import {
  AnimationEventHandler,
  MouseEventHandler,
  ReactNode,
  TransitionEventHandler,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

type Props = {
  open: boolean;
  children?: ReactNode;
  onClose: () => void;
  onExited: () => void;
};

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

  const handleTransitionEnd: TransitionEventHandler = event => {
    if (event.propertyName === "opacity" && !open) {
      handleExited();
    }
  };

  const dialogContent = (
    <div
      className={`${styles.dialog} ${
        open && addStartAnimation ? styles.dialogOpened : ""
      }`}
      onClick={handleClickBackdrop}
      onTransitionEnd={handleTransitionEnd}
    >
      <button className={styles.dialogCloseButton} />
      <div ref={dialogContentRef} className={styles.dialogContent}>
        {children}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

export default Dialog;
