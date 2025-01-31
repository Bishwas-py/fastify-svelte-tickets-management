import {Static, Type} from '@sinclair/typebox'

export const TicketSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  expiredAt: Type.String(),
  price: Type.Integer()
})

export type Ticket = Static<typeof TicketSchema>