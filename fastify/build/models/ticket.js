"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.TicketSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    createdAt: typebox_1.Type.String(),
    updatedAt: typebox_1.Type.String(),
    expiredAt: typebox_1.Type.String(),
    price: typebox_1.Type.Integer()
});
