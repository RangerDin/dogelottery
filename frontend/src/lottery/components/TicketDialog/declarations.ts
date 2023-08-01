import { LotteryTicketId } from "~/lottery/declarations/ticket";
import { PAGE_STATUS_FOR_LOTTERY_TICKET_DIALOG } from "./constants";

export type PageStatusForLotteryTicketDialog =
  (typeof PAGE_STATUS_FOR_LOTTERY_TICKET_DIALOG)[number];

export type SpecificTicketDialogProps = {
  ticketId: LotteryTicketId;
};

export enum TICKET_DIALOG_STATUS {
  VIEW_TICKET = "VIEW_TICKET",
  OPEN_TICKET = "OPEN_TICKET",
  OPENING_TICKET = "OPENING_TICKET",
  SEND_TICKET = "SEND_TICKET",
  SENDING_TICKET = "SENDING_TICKET"
}
