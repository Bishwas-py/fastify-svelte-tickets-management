import {Static, Type} from '@sinclair/typebox'

export const MessageSchema = Type.Object({
  message: Type.String(),
  type_: Type.String(),
})

export const SessionSchema = Type.Object({
  user_id: Type.String(),
  expiredAt: Type.String(),
  _id: Type.String()
})

export type Message = Static<typeof MessageSchema>
export type Session = Static<typeof SessionSchema>