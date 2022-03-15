"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../models/users");
const authenticate_1 = __importDefault(require("../service/authenticate"));
const user_store = new users_1.UserStore();
const user_authorization = async (req, res) => {
    // This function checks whether the given jws token is correct.
    try {
        const user_id = parseInt(req.body.id);
        const user_password = req.body.password;
        // get and check the user by user_id
        const user = await user_store.show(user_id);
        const hashed_password = user.password;
        if (authenticate_1.default.checking_password(user_password, hashed_password)) {
            // build JWT Token
            const jwt_token = authenticate_1.default.get_jwt(user);
            res.send(jwt_token);
        }
        else {
            res.status(401).send("No authorization: wrong credentials");
        }
    }
    catch (error) {
        res.status(401).send("No authorization: " + error);
    }
};
const authenticate_router = (app) => {
    app.use(express_1.default.json());
    app.post("/authorize", user_authorization);
    console.log(user_authorization);
};
exports.default = authenticate_router;
