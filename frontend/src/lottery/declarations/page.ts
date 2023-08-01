import { SpecificTicketDialogProps } from "~/lottery/components/TicketDialog/declarations";
import { SpecificTicketSelectorDialogProps } from "~/lottery/components/TicketSelectorDialog/TicketSelectorDialog";
import { MutableLotteryPageState } from "~/lottery/declarations/state";
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

export type LotteryPageConnectedState = {
  connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED;
  activeTicket: LotteryTicket | null;
  ticketSelectionDialog: UseDialogHookResult<SpecificTicketSelectorDialogProps>;
  ticketDialog: UseDialogHookResult<SpecificTicketDialogProps>;
} & MutableLotteryPageState;
