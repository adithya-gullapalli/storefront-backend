"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const PEPPER = process.env.PEPPER;
function hashing_password(plain_password) {
    // Function to hash the given password
    const hashed_password = bcrypt_1.default.hashSync(plain_password + PEPPER, SALT_ROUNDS);
    return hashed_password;
}
function checking_password(plain_password, hashed_password) {
    const ifCorrect = bcrypt_1.default.compareSync(plain_password + PEPPER, hashed_password);
    return ifCorrect;
}
function verify_jwt(token) {
    // Function to verify the jwt
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
}
function get_jwt(user) {
    return jsonwebtoken_1.default.sign({ user: user }, process.env.TOKEN_SECRET);
}
exports.default = {
    hashing_password,
    checking_password,
    verify_jwt,
    get_jwt
};
