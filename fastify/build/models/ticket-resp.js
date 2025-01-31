"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedTicketSchema = exports.TicketQuerystringSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("./ticket");
exports.TicketQuerystringSchema = typebox_1.Type.Object({
    search: typebox_1.Type.String(),
    order: typebox_1.Type.Integer()
});
exports.PaginatedTicketSchema = typebox_1.Type.Object({
    items: typebox_1.Type.Array(ticket_1.TicketSchema),
    count: typebox_1.Type.Integer(),
    hasMore: typebox_1.Type.Boolean()
});
