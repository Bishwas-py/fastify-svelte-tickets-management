import {ObjectId} from "@fastify/mongodb";

export interface DbUser {
  _id: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbSession {
  _id: ObjectId;
  user_id: ObjectId;
  expiredAt: Date;
}
