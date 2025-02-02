import * as bcrypt from "bcrypt";
import {Db} from "mongodb";
import {User} from "../models/user";
import {Session} from "../models/resp";
import {ObjectId} from "@fastify/mongodb";

const MAX_SESSION_HOURS = 5 * 24;

export async function hasUserDb(db: Db, username: string) {
  return await db.collection('users').countDocuments({username}, {limit: 1});
}

export async function getAuthorizeUser(db: Db, username: string, password: string) {
  const user = await db.collection<User>('users').findOne({username})
  if (!user) return;
  if (await bcrypt.compare(password, user.password)) {
    return user;
  }
}

export async function createUser(db: Db, username: string, password: string) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const now = new Date().toISOString();

  return await db.collection('users').insertOne({
    password: hashedPassword,
    username,
    createdAt: now,
    updatedAt: now
  })
}


export async function createSession(db: Db, user_id: string) {
  const now = new Date();
  const previousSession = await db.collection<Session>('sessions').findOne({
    user_id,
    expiredAt: {$gt: now.toISOString()}
  })
  if (previousSession) {
    return previousSession;
  }
  now.setHours(now.getHours() + MAX_SESSION_HOURS);
  const data = {
    user_id: user_id,
    expiredAt: now.toISOString()
  };
  console.log(data)
  const session = await db.collection<Omit<Session, '_id'>>('sessions').insertOne(data)
  return {
    ...data,
    _id: session.insertedId.toString()
  } as Session
}


export async function getUser(db: Db, session_id: string) {
  const now = new Date();
  const session = await db.collection<Session>('sessions').findOne({
    _id: new ObjectId(session_id),
    expiredAt: {$gt: now.toISOString()}
  })
  if (!session) {
    return;
  }
  const {user_id} = session;
  return await db.collection<User>('users').findOne({
    _id: new ObjectId(user_id)
  });
}
