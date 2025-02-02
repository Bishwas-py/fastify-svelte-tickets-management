import { ObjectId } from 'mongodb';

export interface Session {
  _id: ObjectId;
  userId: ObjectId;
  expiredAt: Date;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateSessionDto {
  userId: ObjectId;
}