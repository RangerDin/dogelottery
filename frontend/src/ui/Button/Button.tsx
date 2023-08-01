import { MouseEventHandler, ReactNode, forwardRef } from "react";

type Props = {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children?: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, ...props }: Props, ref): JSX.Element => {
    return <button ref={ref} className={`button ${className}`} {...props} />;
  }
);

Button.displayName = "Button";

export default Button;
