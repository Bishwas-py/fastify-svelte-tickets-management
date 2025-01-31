import {PaginatedTicket} from "../models/ticket-resp";

export const getTickets = (): PaginatedTicket => {
  return {
    items: [],
    count: 0,
    hasMore: false
  }
}