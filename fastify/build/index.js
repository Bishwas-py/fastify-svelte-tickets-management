"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const ticket_resp_1 = require("./models/ticket-resp");
const get_tickets_1 = require("./helpers/get-tickets");
const signup_1 = require("./models/signup");
const resp_1 = require("./models/resp");
const auth_1 = require("./helpers/auth");
const server = (0, fastify_1.default)();
server.register(require('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: 'mongodb://localhost:27017/fun-ticket'
});
server.post('/signup', {
    schema: {
        body: signup_1.SignUpSchema,
        response: {
            201: resp_1.MessageSchema,
            400: resp_1.MessageSchema
        }
    },
}, function (request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = request.body;
        if (yield (0, auth_1.hasUserDb)(this.mongo.db, username)) {
            reply.code(400).send({
                message: "User exists!",
                type_: "fail"
            });
        }
        yield (0, auth_1.createUser)(this.mongo.db, username, password);
        reply.code(201).send({
            message: "User created!",
            type_: "success"
        });
    });
});
server.post('/signin', {
    schema: {
        body: signup_1.SignUpSchema,
        response: {
            201: resp_1.SessionSchema,
            400: resp_1.MessageSchema
        }
    },
}, function (request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = request.body;
        const user = yield (0, auth_1.getAuthorizeUser)(this.mongo.db, username, password);
        if (!user) {
            reply.code(400).send({
                message: "Do not match!",
                type_: "fail"
            });
            return;
        }
        const session = yield (0, auth_1.createSession)(this.mongo.db, user._id);
        reply.code(201).send(session);
    });
});
server.get('/list', {
    schema: {
        querystring: ticket_resp_1.TicketQuerystringSchema,
        response: {
            200: ticket_resp_1.PaginatedTicketSchema
        }
    }
}, function (request, reply) {
    const { search, order } = request.query;
    console.log({ search, order });
    const paginatedTickets = (0, get_tickets_1.getTickets)();
    reply.code(200).send(paginatedTickets);
});
server.listen({ port: 3000 }, err => {
    if (err)
        throw err;
});
