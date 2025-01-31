import fastify from 'fastify'
import {
  TicketQuerystring,
  TicketQuerystringSchema,
  PaginatedTicket, PaginatedTicketSchema
} from "./models/ticket-resp";
import {getTickets} from "./helpers/get-tickets";
import {SignUpParams, SignUpSchema} from "./models/signup";
import {Message, MessageSchema, Session, SessionSchema} from "./models/resp";
import type {Db, MongoClient} from 'mongodb'
import {getAuthorizeUser, createUser, hasUserDb, createSession} from "./helpers/auth";

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
  Reply: Message
}>(
  '/signup',
  {
    schema: {
      body: SignUpSchema,
      response: {
        201: MessageSchema,
        400: MessageSchema
      }
    },
  },
  async function (request, reply) {
    const {username, password} = request.body;
    if (await hasUserDb(this.mongo.db, username)) {
      reply.code(400).send({
        message: "User exists!",
        type_: "fail"
      });
    }
    await createUser(this.mongo.db, username, password);
    reply.code(201).send({
      message: "User created!",
      type_: "success"
    });
  }
)


server.post<{
  Body: SignUpParams,
  Reply: {
    201: Session,
    400: Message
  }
}>(
  '/signin',
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
    const user = await getAuthorizeUser(this.mongo.db, username, password);
    if (!user) {
      reply.code(400).send({
        message: "Do not match!",
        type_: "fail"
      });
      return;
    }
    const session = await createSession(this.mongo.db, user._id);
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
    console.log({search, order})
    const paginatedTickets = getTickets();
    reply.code(200).send(paginatedTickets);
  })


server.listen({port: 3000}, err => {
  if (err) throw err
})