import {ObjectId} from 'mongodb';

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface PublicUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
