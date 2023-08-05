import { LotteryTicketId } from "~/lottery/declarations/ticket";

export type SpecificTicketDialogProps = {
  ticketId: LotteryTicketId;
};

export enum TICKET_DIALOG_STATUS {
  VIEW_TICKET = "VIEW_TICKET",
  OPEN_TICKET = "OPEN_TICKET",
  SEND_TICKET = "SEND_TICKET"
}
