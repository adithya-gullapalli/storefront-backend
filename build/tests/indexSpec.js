"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const orders_1 = require("../models/orders");
const products_1 = require("../models/products");
const users_1 = require("../models/users");
const AXIOS_OPTIONS = {
    baseURL: "http://localhost:3000"
};
//For first authorization and is given by db-migrate
const test_user_start = {
    id: "1",
    first_name: "Harry",
    last_name: "Potter",
    password: "0602"
};
let jwt_token;
let headers;
describe("First Test", () => {
    beforeAll(async function () {
        process.env.ENV = "test";
        require("../server.js");
        const body = { id: test_user_start.id, password: test_user_start.password };
        console.log("body:", body);
        const res = await axios_1.default.post("/authorize", body, AXIOS_OPTIONS);
        console.log("res:", res);
        jwt_token = res.data;
        console.log(`jwt_token: ${jwt_token}`);
        headers = { Authorization: `${jwt_token}` };
    });
    describe("Server Checking", () => {
        it("Checking Endpoint /", async () => {
            const res = await axios_1.default.get("/", AXIOS_OPTIONS);
            expect(res.status).toBe(200);
        });
        describe("Authorization & User", () => {
            const test_new_user = {
                id: null,
                first_name: "Patrick",
                last_name: "Jane",
                password: "strongPassword"
            };
            it("Unauthorized - Create User /users (POST) - No JWT", async () => {
                const res = await axios_1.default.post("/users", test_new_user, {
                    baseURL: AXIOS_OPTIONS.baseURL,
                    validateStatus: () => true
                });
                expect(res.status).toBe(401);
            });
            let created_user;
            it("Created User /users (POST)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.post("/users", test_new_user, axios_config);
                created_user = res.data;
                expect(created_user.first_name).toBe(test_new_user.first_name);
            });
            it("Showing created User /users/:id (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/users/" + created_user.id, axios_config);
                expect(res.data.first_name).toBe(test_new_user.first_name);
            });
            it("Showing all Users /users (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/users", axios_config);
                const users = res.data;
                expect(users.length > 0).toBeTrue();
            });
            it("Getting JWT token for created_user /authorize (POST)", async () => {
                const body = { id: created_user.id, password: test_new_user.password };
                const res = await axios_1.default.post("/authorize", body, AXIOS_OPTIONS);
                jwt_token = res.data;
                expect(res.status).toBe(200);
            });
        });
        let created_product;
        describe("Product", () => {
            const product_test = {
                id: null,
                name: "Micheal",
                price: 20.2
            };
            it("Created Product /products (POST)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.post("/products", product_test, axios_config);
                created_product = res.data;
                expect(created_product.name).toBe(product_test.name);
            });
            it("Showing created Product /products/:id (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/products/" + created_product.id, axios_config);
                expect(res.data.name).toBe(created_product.name);
            });
            it("Showing all Products /products (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/products", axios_config);
                const products = res.data;
                expect(products.length > 0).toBeTrue();
            });
        });
        let created_order;
        describe("Order", () => {
            const order_test = {
                id: null,
                user_id: 1,
                status: "active"
            };
            it("Created Order /orders (POST)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.post("/orders", order_test, axios_config);
                created_order = res.data;
                expect(created_order.user_id).toBe(order_test.user_id);
            });
            it("Showing created Order /orders/:id (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/orders/" + created_order.id, axios_config);
                expect(res.data.id).toBe(created_order.id);
            });
            it("Getting Current Order by User /orders/users/:id/current (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get(`/orders/users/${order_test.user_id}/current`, axios_config);
                expect(res.data.id).toBe(created_order.id);
            });
            it("Showing all Order /orders (GET)", async () => {
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.get("/orders", axios_config);
                const orders = res.data;
                expect(orders.length > 0).toBeTrue();
            });
            it("Adding Product to Order /orders/:id/products/ (POST)", async () => {
                const new_product = {
                    prodcut_id: 1,
                    quantity: 12
                };
                const axios_config = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const res = await axios_1.default.post(`/orders/${created_order.id}/products`, new_product, axios_config);
                expect(res.data.order_id).toBe(created_order.id);
            });
        });
    });
    describe("Database Checking", () => {
        describe("User", () => {
            const user_store = new users_1.UserStore();
            const test_new_user = {
                id: null,
                first_name: "Patrick",
                last_name: "Jane",
                password: "strongPassword"
            };
            let created_user;
            it("Created User", async () => {
                created_user = await user_store.create(test_new_user);
                expect(created_user.first_name).toBe(test_new_user.first_name);
            });
            it("Showing created User", async () => {
                const res = await user_store.show(created_user.id);
                expect(res.first_name).toBe(test_new_user.first_name);
            });
            it("Index Users", async () => {
                const res = await user_store.index();
                const users = res;
                expect(users.length > 0).toBeTrue();
            });
        });
        let created_product;
        describe("Product", () => {
            const product_store = new products_1.ProductStore();
            const product_test = {
                id: null,
                name: "Micheal",
                price: 20.2
            };
            it("Created Product", async () => {
                created_product = await product_store.create(product_test);
                expect(created_product.name).toBe(product_test.name);
            });
            it("Showing created Product", async () => {
                const res = await product_store.show(created_product.id);
                expect(res.name).toBe(created_product.name);
            });
            it("Index Products", async () => {
                const products = await product_store.index();
                expect(products.length > 0).toBeTrue();
            });
        });
        let created_order;
        describe("Order", () => {
            const orderStore = new orders_1.OrderStore();
            const order_test = {
                id: null,
                user_id: 1,
                status: "active"
            };
            it("Created Order", async () => {
                created_order = await orderStore.create(order_test);
                expect(created_order.user_id).toBe(order_test.user_id);
            });
            it("Showing created Order", async () => {
                const res = await orderStore.show(created_order.id);
                expect(res.id).toBe(created_order.id);
            });
            it("Index Orders", async () => {
                const orders = await orderStore.index();
                expect(orders.length > 0).toBeTrue();
            });
            it("Geting current order by user", async () => {
                const res = await orderStore.showCurrentByUser(created_order.user_id);
                expect(res.id).toBe(created_order.id);
            });
            it("Adding product to order", async () => {
                const new_product = {
                    prodcut_id: 1,
                    quantity: 12
                };
                const res = await orderStore.addProduct(new_product.prodcut_id, created_order.id, new_product.quantity);
                expect(res.order_id).toBe(created_order.id);
            });
        });
    });
});
