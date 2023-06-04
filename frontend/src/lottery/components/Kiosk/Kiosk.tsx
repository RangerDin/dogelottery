import KioskContent from "~/lottery/components/Kiosk/KioskContent";
import KioskSkeleton from "~/lottery/components/Kiosk/KioskSkeleton";
import { LotteryPageState } from "~/lottery/declarations/state";
import { LotteryPageHandlers } from "~/lottery/useLotteryPageState";

type Props = {
  className?: string;
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const Kiosk = ({ className, state, handlers }: Props): JSX.Element => {
  return (
    <section className={className}>
      {state.checkingConnection ? (
        <KioskSkeleton />
      ) : (
        <KioskContent state={state} handlers={handlers} />
      )}
    </section>
  );
};

export default Kiosk;
