import {
  LotteryTicket,
  LotteryTicketHue,
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";

export enum LOTTERY_PAGE_ACTION_TYPE {
  SET_ADDRESS = "SET_ADDRESS",
  SET_TICKET_PREPARING_PROGRESS = "SET_TICKET_PREPARING_PROGRESS",
  START_CONNECTION = "START_CONNECTION",
  SET_CONNECTED = "SET_CONNECTED",
  START_DISCONNECTION = "START_DISCONNECTION",
  SET_DISCONNECTED = "SET_DISCONNECTED",
  START_TICKET_PREPARING = "START_TICKET_PREPARING",
  STOP_TICKET_PREPARING = "STOP_TICKET_PREPARING",
  START_SETTING_ALLOWANCE = "START_SETTING_ALLOWANCE",
  START_TICKET_PURCHASING = "SET_ALLOWANCE_APPROVED",
  COMPLETE_TICKET_PURCHASING = "COMPLETE_TICKET_PURCHASING",
  CANCEL_TICKET_PURCHASING = "CANCEL_TICKET_PURCHASING",
  START_SENDING_TICKET = "START_SENDING_TICKET",
  COMPLETE_SENDING_TICKET = "COMPLETE_SENDING_TICKET",
  CANCEL_SENDING_TICKET = "CANCEL_SENDING_TICKET",
  START_OPENING_TICKET = "START_OPENING_TICKET",
  CANCEL_OPENING_TICKET = "CANCEL_OPENING_TICKET",
  COMPLETE_OPENING_TICKET = "COMPLETE_OPENING_TICKET"
}

export type LotteryPageAction =
  | SetAddressAction
  | SetTicketPreparingAction
  | StartConnectionAction
  | SetConnectedAction
  | StartDisconnectionAction
  | SetDisconnectedAction
  | StartTicketPreparingAction
  | StopTicketPreparingAction
  | StartSettingAllowanceAction
  | StartTicketPurchasingAction
  | TicketPurchasedAction
  | CancelTicketPurchasingAction
  | StartSendingTicketAction
  | CompleteSendingTicketAction
  | CancelSendingTicketAction
  | StartOpeningTicketAction
  | CompleteOpeningTicketAction
  | CancelOpeningTicketAction;

export type SetAddressAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.SET_ADDRESS;
  payload: {
    address: string;
  };
};

export type SetTicketPreparingAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.SET_TICKET_PREPARING_PROGRESS;
  payload: {
    inProgress: boolean;
  };
};

export type StartConnectionAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_CONNECTION;
};

export type SetConnectedAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.SET_CONNECTED;
};

export type StartDisconnectionAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_DISCONNECTION;
};

export type SetDisconnectedAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.SET_DISCONNECTED;
};

export type StartTicketPreparingAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PREPARING;
};

export type StopTicketPreparingAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.STOP_TICKET_PREPARING;
};

export type StartSettingAllowanceAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_SETTING_ALLOWANCE;
};

export type StartTicketPurchasingAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PURCHASING;
};

export type TicketPurchasedAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_TICKET_PURCHASING;
  payload: {
    ticket: LotteryTicket;
  };
};

export type CancelTicketPurchasingAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_TICKET_PURCHASING;
};

export type StartSendingTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_SENDING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
  };
};

export type CompleteSendingTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_SENDING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
  };
};

export type CancelSendingTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_SENDING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
  };
};

export type StartOpeningTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.START_OPENING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
    openedSlot: LotteryTicketSlot;
  };
};

export type CompleteOpeningTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_OPENING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
    ticketHue: LotteryTicketHue;
    openedSlot: LotteryTicketSlot;
    winningSlot: LotteryTicketSlot;
  };
};

export type CancelOpeningTicketAction = {
  type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_OPENING_TICKET;
  payload: {
    ticketId: LotteryTicketId;
  };
};
