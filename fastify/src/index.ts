import fastify from 'fastify'
import {
  TicketQuerystring,
  TicketQuerystringSchema,
  PaginatedTicket, PaginatedTicketSchema
} from "./models/ticket-resp";
import {getTickets} from "./helpers/get-tickets";
import {SessionHeadParams, SessionHeadSchema, SignUpParams, SignUpSchema} from "./models/signup";
import {Message, MessageSchema, Session, SessionSchema} from "./models/resp";
import type {Db, MongoClient} from 'mongodb'
import {getAuthorizeUser, createUser, hasUserDb, createSession, getUser} from "./helpers/auth";
import {User, UserSchema} from "./models/user";
import * as repl from "node:repl";

const server = fastify();

declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    }
  }
}

server.register(require('@fastify/mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: 'mongodb://localhost:27017/fun-ticket'
})


server.post<{
  Body: SignUpParams,
  Reply: {
    201: Session,
    400: Message
  }
}>(
  '/signup',
  {
    schema: {
      body: SignUpSchema,
      response: {
        201: SessionSchema,
        400: MessageSchema
      }
    },
  },
  async function (request, reply) {
    const {username, password} = request.body;
    let user_id: string;
    if (await hasUserDb(this.mongo.db, username)) {
      const user = await getAuthorizeUser(this.mongo.db, username, password);
      if (!user) {
        reply.code(400).send({
          message: "Do not match!",
          type_: "fail"
        });
        return;
      }
      user_id = user._id.toString();
    } else {
      user_id = (await createUser(this.mongo.db, username, password)).insertedId.toString();
    }
    const session = await createSession(this.mongo.db, user_id);
    reply.code(201).send(session);
  }
)

server.get<{
  Querystring: TicketQuerystring,
  Reply: PaginatedTicket
}>(
  '/list',
  {
    schema: {
      querystring: TicketQuerystringSchema,
      response: {
        200: PaginatedTicketSchema
      }
    }
  },
  function (request, reply) {
    const {search, order} = request.query;
    const paginatedTickets = getTickets();
    reply.code(200).send(paginatedTickets);
  })


server.get<{
  Headers: SessionHeadParams,
  Reply: {
    200: User,
    404: Message
  }
}>(
  '/get-user',
  {
    schema: {
      response: {
        200: UserSchema,
        400: MessageSchema
      },
      headers: SessionHeadSchema
    }
  },
  async function (request, reply) {
    const {session_id} = request.headers;
    const user = await getUser(this.mongo.db, session_id);
    if (user) {
      reply.code(200).send(user);
    } else {
      reply.code(404).send({
        message: 'User not found',
        type_: 'fail'
      })
    }
  })


server.listen({port: 3000}, err => {
  if (err) throw err
})