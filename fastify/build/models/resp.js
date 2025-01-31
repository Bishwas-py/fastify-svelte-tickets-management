"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchema = exports.MessageSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.MessageSchema = typebox_1.Type.Object({
    message: typebox_1.Type.String(),
    type_: typebox_1.Type.String(),
});
exports.SessionSchema = typebox_1.Type.Object({
    user_id: typebox_1.Type.String(),
    expiredAt: typebox_1.Type.String(),
    _id: typebox_1.Type.String()
});
