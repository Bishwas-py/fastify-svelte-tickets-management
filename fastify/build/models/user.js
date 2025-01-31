"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.UserSchema = typebox_1.Type.Object({
    username: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
    createAt: typebox_1.Type.Date(),
    updateAt: typebox_1.Type.Date(),
    _id: typebox_1.Type.String(),
});
