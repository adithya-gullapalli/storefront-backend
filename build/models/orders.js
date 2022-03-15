"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async index() {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Orders";
            const res = await connect.query(sql);
            connect.release();
            return res.rows;
        }
        catch (err) {
            throw new Error(`Cannot get the order: ${err}`);
        }
    }
    async show(id) {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Orders WHERE id=($1)";
            const res = await connect.query(sql, [id]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot get Order : ${err}`);
        }
    }
    async showCurrentByUser(user_id) {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1";
            const res = await connect.query(sql, [user_id]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot get Order : ${err}`);
        }
    }
    async create(order) {
        try {
            const connect = await database_1.default.connect();
            const sql = "INSERT INTO Orders (user_id, status) VALUES($1, $2) RETURNING *";
            const res = await connect.query(sql, [order.user_id, order.status]);
            const result = res.rows[0];
            result.user_id = parseInt(result.user_id);
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot add new order ${order.user_id}: ${err}`);
        }
    }
    async addProduct(product_id, order_id, quantity) {
        try {
            const connect = await database_1.default.connect();
            const sql = "INSERT INTO Order_products (product_id,order_id,quantity) VALUES($1, $2, $3) RETURNING *";
            const res = await connect.query(sql, [product_id, order_id, quantity]);
            const result = res.rows[0];
            result.order_id = parseInt(result.order_id);
            result.product_id = parseInt(result.product_id);
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot add new Product: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
