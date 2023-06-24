import createJazzicon from "@metamask/jazzicon";
import { useEffect, useRef } from "react";

type Props = {
  address: string;
};

const LOGO_DIAMETER = 48;

const Logo = ({ address }: Props): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = createJazzicon(LOGO_DIAMETER, address);
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.append(icon);

    console.log({
      icon
    });

    return () => {
      container.removeChild(icon);
    };
  }, [address]);

  return <div ref={containerRef}></div>;
};

export default Logo;
