import {Type, Static} from '@sinclair/typebox'
import {TicketSchema} from './ticket'

export const TicketQuerystringSchema = Type.Object({
  search: Type.String(),
  order: Type.Integer()
})

export const PaginatedTicketSchema = Type.Object({
  items: Type.Array(TicketSchema),
  count: Type.Integer(),
  hasMore: Type.Boolean()
})

// Type exports
export type TicketQuerystring = Static<typeof TicketQuerystringSchema>
export type PaginatedTicket = Static<typeof PaginatedTicketSchema>
