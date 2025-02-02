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
import {u_create, u_exits, create_session, get_user, authorized_user} from "./helpers/auth";
import {PubUser, User, UserPubSchema, UserSchema} from "./models/user";

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
    if (await u_exits(this.mongo.db, username)) {
      const user = await authorized_user(this.mongo.db, username, password);
      if (!user) {
        reply.code(400).send({
          message: "Do not match!",
          type_: "fail"
        });
        return;
      }
      user_id = user._id.toString();
    } else {
      user_id = (await u_create(this.mongo.db, username, password))._id;
    }
    const session = await create_session(this.mongo.db, user_id);
    reply.code(201).send(session);
  }
)

server.get<{
  Headers: SessionHeadParams,
  Reply: {
    200: PubUser,
    404: Message
  }
}>(
  '/get-user',
  {
    schema: {
      response: {
        200: UserPubSchema,
        400: MessageSchema
      },
      headers: SessionHeadSchema
    }
  },
  async function (request, reply) {
    const {session_id} = request.headers;
    const user = await get_user(this.mongo.db, session_id);
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