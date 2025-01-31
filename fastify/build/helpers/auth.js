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
exports.hasUserDb = hasUserDb;
exports.getAuthorizeUser = getAuthorizeUser;
exports.createUser = createUser;
exports.createSession = createSession;
const bcrypt_1 = __importDefault(require("bcrypt"));
const MAX_SESSION_DAYS = 5;
function hasUserDb(db, username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db.collection('users').countDocuments({ username }, { limit: 1 });
    });
}
function getAuthorizeUser(db, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db.collection('users').findOne({ username });
        if (!user)
            return;
        if (yield bcrypt_1.default.compare(password, user.password)) {
            return user;
        }
    });
}
function createUser(db, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const now = new Date().toISOString();
        return yield db.collection('users').insertOne({
            password: hashedPassword,
            username,
            createdAt: now,
            updatedAt: now
        });
    });
}
function createSession(db, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        now.setMinutes(now.getDay() + MAX_SESSION_DAYS);
        const previousSession = yield db.collection('sessions').findOne({ user_id });
        if (previousSession) {
            return previousSession;
        }
        const data = {
            user_id: user_id,
            expiredAt: now.toISOString()
        };
        const session = yield db.collection('sessions').insertOne(data);
        return Object.assign(Object.assign({}, data), { _id: session.insertedId.toString() });
    });
}
