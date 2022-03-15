"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async index() {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Products";
            const res = await connect.query(sql);
            connect.release();
            return res.rows;
        }
        catch (err) {
            throw new Error(`Cannot get product: ${err}`);
        }
    }
    async show(id) {
        try {
            const connect = await database_1.default.connect();
            const sql = "SELECT * FROM Products WHERE id=($1)";
            const res = await connect.query(sql, [id]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot get product with id: ${err}`);
        }
    }
    async create(product) {
        try {
            const connect = await database_1.default.connect();
            const sql = "INSERT INTO Products (name,price) VALUES($1, $2) RETURNING *";
            const res = await connect.query(sql, [product.name, product.price]);
            const result = res.rows[0];
            connect.release();
            return result;
        }
        catch (err) {
            throw new Error(`Cannot add new product : ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
