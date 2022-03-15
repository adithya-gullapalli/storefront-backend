"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authenticate_1 = __importDefault(require("./handlers/authenticate"));
const users_1 = __importDefault(require("./handlers/users"));
const products_1 = __importDefault(require("./handlers/products"));
const orders_1 = __importDefault(require("./handlers/orders"));
const app = (0, express_1.default)();
const port = 3000; // default port to listen
app.use((0, cors_1.default)());
(0, authenticate_1.default)(app);
(0, users_1.default)(app);
(0, products_1.default)(app);
(0, orders_1.default)(app);
app.get("/", (_req, res) => {
    res.status(200).send("Server started");
});
// starting the Express server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
