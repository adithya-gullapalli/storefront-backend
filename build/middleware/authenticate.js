"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = __importDefault(require("../service/authenticate"));
const verify_token = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send("Authorization missing");
        return;
    }
    try {
        const authorization_header = req.headers.authorization;
        const token = authorization_header.split(" ")[1];
        //throws error if the jtw is wrong or manipulated.
        authenticate_1.default.verify_jwt(token);
        next();
    }
    catch (error) {
        res.status(401).send("Not authorized: " + error);
        return;
    }
};
exports.default = { verify_token };
