import { SpecificTicketSelectorDialogProps } from "~/lottery/components/TicketSelectorDialog/TicketSelectorDialog";
import {
  LotteryPageStateWithoutActiveTicket,
  MutableLotteryPageStateWithActiveTicketId
} from "~/lottery/declarations/state";
import { LotteryTicket } from "~/lottery/declarations/ticket";
import { UseDialogHookResult } from "~/ui/Dialog/useDialog";

export enum LOTTERY_PAGE_CONNECTION_STATUS {
  CHECKING_CONNECTION = "CHECKING_CONNECTION",
  DISCONNECTED = "DISCONNECTED",
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING"
}

export type LotteryPageState =
  | {
      connectionStatus: Exclude<
        LOTTERY_PAGE_CONNECTION_STATUS,
        LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED
      >;
    }
  | LotteryPageConnectedState;

export type LotteryPageConnectedState = LotteryPageConnectedCommonState &
  MutableLotteryPageStateWithActiveTicket;

type LotteryPageConnectedCommonState = {
  connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED;
  transition: {
    shown: boolean;
    inProgress: boolean;
  };
  address?: string;
  ticketSelectionDialog: UseDialogHookResult<SpecificTicketSelectorDialogProps>;
};

export type MutableLotteryPageStateWithActiveTicket =
  | LotteryPageStateWithoutActiveTicket
  | ReplaceActiveIdToActive<MutableLotteryPageStateWithActiveTicketId>;

type ReplaceActiveIdToActive<State extends { activeTicketId: string }> = Omit<
  State,
  "activeTicketId"
> & {
  activeTicket: LotteryTicket;
};
