import * as bcrypt from "bcrypt";
import {Db, ObjectId} from "mongodb";
import {Model} from "./model";
import {DbSession, DbUser} from "../models/db";
import {PubUser} from "../models/user";

const MAX_SESSION_HOURS = 5 * 24;

export async function u_exits(db: Db, username: string): Promise<boolean> {
  return (await db.collection('users').countDocuments({username}, {limit: 1})) > 0;
}

export async function authorized_user(db: Db, username: string, password: string) {
  const user = await db.collection<DbUser>('users').findOne({username});
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? Model.toUser(user) : null;
}

/*
Returns user_id
 */
export async function u_create(db: Db, username: string, password: string): Promise<PubUser> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const now = new Date();

  const result = await db.collection<DbUser>('users').insertOne({
    _id: new ObjectId(),
    username,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  });

  return Model.toUser({
    _id: result.insertedId,
    username,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  });
}

export async function create_session(db: Db, user_id: string) {
  const userObjectId = Model.toObjectId(user_id);
  if (!userObjectId) return null;

  const now = new Date();
  const expiredAt = new Date(now.getTime() + (MAX_SESSION_HOURS * 60 * 60 * 1000));

  // Check for existing valid session
  const existingSession = await db.collection<DbSession>('sessions').findOne({
    user_id: userObjectId,
    expiredAt: {$gt: now}
  });

  if (existingSession) {
    return Model.toSession(existingSession);
  }

  // Create new session
  const session = await db.collection<DbSession>('sessions').insertOne({
    _id: new ObjectId(),
    user_id: userObjectId,
    expiredAt
  });

  return Model.toSession({
    _id: session.insertedId,
    user_id: userObjectId,
    expiredAt
  });
}

export async function get_user(db: Db, session_id: string) {
  const sessionObjectId = Model.toObjectId(session_id);
  if (!sessionObjectId) return null;

  const now = new Date();
  const session = await db.collection<DbSession>('sessions').findOne({
    _id: sessionObjectId,
    expiredAt: {$gt: now}
  });

  if (!session) return null;

  const user = await db.collection<DbUser>('users').findOne({
    _id: session.user_id
  });

  return user ? Model.toUser(user) : null;
}