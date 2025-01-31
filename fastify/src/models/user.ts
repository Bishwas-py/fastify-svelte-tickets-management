import {Static, Type} from '@sinclair/typebox'

export const UserSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
  createAt: Type.Date(),
  updateAt: Type.Date(),
  _id: Type.String(),
})

export type User = Static<typeof UserSchema>