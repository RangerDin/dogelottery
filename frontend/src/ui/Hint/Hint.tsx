import Fade from "~/ui/animation/Fade";
import styles from "./styles.module.css";

type Props = {
  in: boolean;
  children: string;
  className?: string;
};

const Hint = ({
  in: transitionIn,
  children,
  className
}: Props): JSX.Element => {
  return (
    <Fade in={transitionIn} mountOnEnter unmountOnExit>
      <div className={`${styles.hint} ${className}`}>{children}</div>
    </Fade>
  );
};

export default Hint;
