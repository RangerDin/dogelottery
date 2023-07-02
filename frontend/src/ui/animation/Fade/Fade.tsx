import { ReactElement, cloneElement, isValidElement } from "react";
import CSSTransition, {
  CSSTransitionClassNames
} from "react-transition-group/CSSTransition";
import styles from "./styles.module.css";

type Props = {
  in: boolean;
  children: ReactElement<{
    className?: string;
  }>;
  timeout?: number;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onEntered?: () => void;
  onExited?: () => void;
};

const DEFAULT_TIMEOUT = 300;

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

const Fade = (props: Props): JSX.Element => {
  return (
    <CSSTransition
      appear
      in={props.in}
      classNames={CLASSES}
      timeout={props.timeout ?? DEFAULT_TIMEOUT}
      mountOnEnter={props.mountOnEnter}
      unmountOnExit={props.unmountOnExit}
      onExited={props.onExited}
      onEntered={props.onEntered}
    >
      {(state, childProps) => {
        if (!isValidElement(props.children)) {
          return props.children;
        }

        return cloneElement(props.children, {
          ...childProps,
          className: `${props.children.props?.className} ${styles.fade}`
        });
      }}
    </CSSTransition>
  );
};

export default Fade;
