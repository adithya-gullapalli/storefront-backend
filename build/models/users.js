"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
class UserStore {
    async index() {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Users";
            const res = await connect.query(sql);
            connect.release();
            return res.rows;
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    async show(id) {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Users WHERE id=($1)";
            const res = await connect.query(sql, [id]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot get user with id: ${err}`);
        }
    }
    async create(current_user) {
        try {
            const connect = await database_1.default.connect();
            const sql = "INSERT INTO Users (first_name,last_name,password) VALUES($1, $2, $3) RETURNING *";
            const res = await connect.query(sql, [current_user.first_name, current_user.last_name, current_user.password]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot add new user: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
