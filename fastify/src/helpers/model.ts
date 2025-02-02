import {ObjectId} from '@fastify/mongodb'
import {PubUser, User} from "../models/user";
import {DbSession, DbUser} from "../models/db";
import {Session} from "../models/resp";

export class Model {
  static toObjectId(id: string): ObjectId | null {
    try {
      return new ObjectId(id);
    } catch {
      return null;
    }
  }

  static toUser(dbUser: DbUser): PubUser {
    return {
      _id: dbUser._id.toString(),
      username: dbUser.username,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString()
    };
  }

  static toSession(dbSession: DbSession): Session {
    return {
      _id: dbSession._id.toString(),
      user_id: dbSession.user_id.toString(),
      expiredAt: dbSession.expiredAt.toISOString()
    };
  }
}