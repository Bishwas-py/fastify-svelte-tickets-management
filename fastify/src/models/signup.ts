import {Static, Type} from '@sinclair/typebox'

export const SignUpSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export type SignUpParams = Static<typeof SignUpSchema>
