"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../models/products");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
require("dotenv/config");
const store = new products_1.ProductStore();
const index = async (_req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in showing all products: ${err}`);
    }
};
const show = async (req, res) => {
    try {
        const product_id = parseInt(req.params.id);
        const product = await store.show(product_id);
        res.json(product);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in showing product: ${err}`);
    }
};
const create = async (req, res) => {
    try {
        const name = req.body.name;
        const price = req.body.price;
        const product = {
            id: null,
            name: name,
            price: price
        };
        const product_response = await store.create(product);
        res.json(product_response);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in creating product: ${err}`);
    }
};
const product_router = (app) => {
    app.use(express_1.default.json());
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", authenticate_1.default.verify_token, create);
};
exports.default = product_router;
