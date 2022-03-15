"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../models/users");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const orders_1 = require("../models/orders");
require("dotenv/config");
const store = new orders_1.OrderStore();
const user_store = new users_1.UserStore();
const index = async (_req, res) => {
    try {
        const result = await store.index();
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};
const show = async (req, res) => {
    try {
        const order_id = parseInt(req.params.id);
        const result = await store.show(order_id);
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};
const create = async (req, res) => {
    try {
        const user_id = parseInt(req.body.user_id);
        const status = req.body.status;
        const user = await user_store.show(user_id);
        if (user) {
            const order = {
                id: null,
                user_id: user_id,
                status: status
            };
            const result = await store.create(order);
            res.json(result);
        }
        else {
            res.status(404);
            res.json(`user_id:${user_id} not found`);
        }
    }
    catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};
const addProduct = async (req, res) => {
    try {
        const order_id = parseInt(req.params.id);
        const product_id = parseInt(req.body.product_id);
        const quantity = parseInt(req.body.quantity);
        const result = await store.addProduct(product_id, order_id, quantity);
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};
const showCurrentUser = async (req, res) => {
    try {
        const user_id = parseInt(req.params.id);
        const result = await store.showCurrentByUser(user_id);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404);
            res.json(`No order found with user_id:${user_id}`);
        }
    }
    catch (err) {
        res.status(400);
        res.json(`${err}`);
    }
};
const order_router = (app) => {
    app.use(express_1.default.json());
    app.get("/orders", authenticate_1.default.verify_token, index);
    app.get("/orders/:id", authenticate_1.default.verify_token, show);
    app.post("/orders", authenticate_1.default.verify_token, create);
    app.post("/orders/:id/products", authenticate_1.default.verify_token, addProduct);
    app.get("/orders/users/:id/current", authenticate_1.default.verify_token, showCurrentUser);
};
exports.default = order_router;
