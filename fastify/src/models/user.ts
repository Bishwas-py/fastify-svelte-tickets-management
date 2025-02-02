import {Static, Type} from '@sinclair/typebox'

export const UserSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  _id: Type.String(),
})

export type User = Static<typeof UserSchema>