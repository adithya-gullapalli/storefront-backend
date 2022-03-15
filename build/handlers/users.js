"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const users_1 = require("../models/users");
const authenticate_1 = __importDefault(require("../service/authenticate"));
const authenticate_2 = __importDefault(require("../middleware/authenticate"));
const store = new users_1.UserStore();
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in showing all users: ${err}`);
    }
};
const show = async (req, res) => {
    try {
        const user_id = parseInt(req.params.id);
        const user = await store.show(user_id);
        res.json(user);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in showing user: ${err}`);
    }
};
const create = async (req, res) => {
    try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const password = req.body.password;
        const hashed_password = authenticate_1.default.hashing_password(password);
        const user = {
            id: null,
            first_name: first_name,
            last_name: last_name,
            password: hashed_password
        };
        const user_response = await store.create(user);
        // getting jwtToken from /authenticate via API call
        res.json(user_response);
    }
    catch (err) {
        res.status(400);
        res.json(`Error in creating user: ${err}`);
    }
};
const user_router = (app) => {
    app.use(express_1.default.json());
    app.get("/users", authenticate_2.default.verify_token, index);
    app.get("/users/:id", authenticate_2.default.verify_token, show);
    app.post("/users", create);
};
exports.default = user_router;
