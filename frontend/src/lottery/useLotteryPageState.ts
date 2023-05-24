import { useState } from "react";
import { LotteryPageState } from "~/lottery/declarations/state";

type UseLotteryPageStateResult = {
  state: LotteryPageState;
};

const INITIAL_STATE: LotteryPageState = {
  connected: false
};

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [state] = useState<LotteryPageState>(INITIAL_STATE);

  return {
    state
  };
};

export default useLotteryPageState;
