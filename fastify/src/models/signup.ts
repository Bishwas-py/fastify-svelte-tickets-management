import {Static, Type} from '@sinclair/typebox'

export const SignUpSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})


export const SessionHeadSchema = Type.Object({
  session_id: Type.String()
})
export type SignUpParams = Static<typeof SignUpSchema>
export type SessionHeadParams = Static<typeof SessionHeadSchema>