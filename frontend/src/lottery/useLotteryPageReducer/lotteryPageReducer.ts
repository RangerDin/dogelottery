import { Reducer } from "react";
import {
  MutableLotteryPageState,
  MutableLotteryPageTicketPurchaseStatus
} from "~/lottery/declarations/state";
import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import {
  CancelOpeningTicketAction,
  CancelSendingTicketAction,
  CompleteOpeningTicketAction,
  CompleteSendingTicketAction,
  LOTTERY_PAGE_ACTION_TYPE,
  LotteryPageAction,
  SetAddressAction,
  SetTicketPreparingAction,
  StartOpeningTicketAction,
  StartSendingTicketAction,
  TicketPurchasedAction
} from "./declarations";

const ACTION_REDUCERS = {
  [LOTTERY_PAGE_ACTION_TYPE.SET_ADDRESS]: (
    previousState: MutableLotteryPageState,
    action: SetAddressAction
  ) => ({
    ...previousState,
    address: action.payload.address
  }),
  [LOTTERY_PAGE_ACTION_TYPE.SET_TICKET_PREPARING_PROGRESS]: (
    previousState: MutableLotteryPageState,
    action: SetTicketPreparingAction
  ) => ({
    ...previousState,
    ticketPreparing: {
      inProgress: action.payload.inProgress
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_CONNECTION]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    connection: {
      in: true,
      inProgress: true
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.SET_CONNECTED]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    connection: {
      in: true,
      inProgress: false
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_DISCONNECTION]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    connection: {
      in: false,
      inProgress: true
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.SET_DISCONNECTED]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    tickets: [],
    connection: {
      in: false,
      inProgress: false
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PREPARING]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    ticketPreparing: {
      inProgress: true
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.STOP_TICKET_PREPARING]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    ticketPreparing: {
      inProgress: false
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_SETTING_ALLOWANCE]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    ticketPurchase: {
      inProgress: true,
      status: MutableLotteryPageTicketPurchaseStatus.setAllowance
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PURCHASING]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    ticketPurchase: {
      inProgress: true,
      status: MutableLotteryPageTicketPurchaseStatus.ticketPurchasing
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.COMPLETE_TICKET_PURCHASING]: (
    previousState: MutableLotteryPageState,
    action: TicketPurchasedAction
  ) => ({
    ...previousState,
    tickets: [...previousState.tickets, action.payload.ticket],
    ticketPurchase: {
      inProgress: false
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.CANCEL_TICKET_PURCHASING]: (
    previousState: MutableLotteryPageState
  ) => ({
    ...previousState,
    ticketPurchase: {
      inProgress: false
    }
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_SENDING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: StartSendingTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.map(ticket => {
      if (ticket.id !== action.payload.ticketId) {
        return ticket;
      }

      if (ticket.status === LotteryTicketStatus.NEW) {
        return {
          ...ticket,
          status: LotteryTicketStatus.SENDING_NEW
        };
      }

      if (ticket.status === LotteryTicketStatus.OPENED) {
        return {
          ...ticket,
          status: LotteryTicketStatus.SENDING_OPENED
        };
      }

      return ticket;
    })
  }),
  [LOTTERY_PAGE_ACTION_TYPE.COMPLETE_SENDING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: CompleteSendingTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.filter(
      ({ id }) => id !== action.payload.ticketId
    )
  }),
  [LOTTERY_PAGE_ACTION_TYPE.CANCEL_SENDING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: CancelSendingTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.map(ticket => {
      if (
        ticket.status === LotteryTicketStatus.SENDING_NEW &&
        ticket.id === action.payload.ticketId
      ) {
        return {
          ...ticket,
          status: LotteryTicketStatus.NEW
        };
      }

      if (
        ticket.status === LotteryTicketStatus.SENDING_OPENED &&
        ticket.id === action.payload.ticketId
      ) {
        return {
          ...ticket,
          status: LotteryTicketStatus.OPENED
        };
      }

      return ticket;
    })
  }),
  [LOTTERY_PAGE_ACTION_TYPE.START_OPENING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: StartOpeningTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.map(ticket => {
      if (ticket.id !== action.payload.ticketId) {
        return ticket;
      }

      const openingTicket: LotteryTicket = {
        ...ticket,
        status: LotteryTicketStatus.OPENING,
        openedSlot: action.payload.openedSlot
      };

      return openingTicket;
    })
  }),
  [LOTTERY_PAGE_ACTION_TYPE.CANCEL_OPENING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: CancelOpeningTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.map(ticket => {
      if (ticket.id !== action.payload.ticketId) {
        return ticket;
      }

      const openingTicket: LotteryTicket = {
        id: ticket.id,
        status: LotteryTicketStatus.NEW
      };

      return openingTicket;
    })
  }),
  [LOTTERY_PAGE_ACTION_TYPE.COMPLETE_OPENING_TICKET]: (
    previousState: MutableLotteryPageState,
    action: CompleteOpeningTicketAction
  ) => ({
    ...previousState,
    tickets: previousState.tickets.map(ticket => {
      if (ticket.id !== action.payload.ticketId) {
        return ticket;
      }

      const openedTicket: LotteryTicket = {
        ...ticket,
        status: LotteryTicketStatus.OPENED,
        winningSlot: action.payload.winningSlot,
        ticketHue: action.payload.ticketHue,
        openedSlot: action.payload.openedSlot
      };

      return openedTicket;
    })
  })
};
// @ts-ignore simplify getting a reducer
export const lotteryPageReducer: Reducer<
  MutableLotteryPageState,
  LotteryPageAction
> = (previousState, action) => {
  // @ts-ignore simplify getting a reducer
  const actionHandler = ACTION_REDUCERS[action.type];

  // @ts-ignore simplify getting a reducer
  return actionHandler(previousState, action);
};
