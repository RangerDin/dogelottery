import { useReducer } from "react";
import { MutableLotteryPageState } from "~/lottery/declarations/state";
import { LotteryPageAction } from "./declarations";
import { lotteryPageReducer } from "./lotteryPageReducer";

const INITIAL_STATE: MutableLotteryPageState = {
  tickets: [],
  ticketPreparing: {
    inProgress: false
  },
  connection: {
    inProgress: false,
    in: false
  },
  ticketPurchase: {
    inProgress: false
  }
};

type UseLotteryPageReducerResult = {
  state: MutableLotteryPageState;
  dispatch: (action: LotteryPageAction) => void;
};

const useLotteryPageReducer = (): UseLotteryPageReducerResult => {
  const [state, dispatch] = useReducer(lotteryPageReducer, INITIAL_STATE);

  return {
    state,
    dispatch
  };
};

export default useLotteryPageReducer;
