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
// needed for first authorization, is added by db-migrate up
const testUserStart = {
    id: "1",
    first_name: "Hannes",
    last_name: "Roth",
    password: "1234"
};
let jwtToken;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let headers;
describe("Main Test", () => {
    beforeAll(async function () {
        // set database for Server to "test". Felt it is better here, as setting the environment within package would be Os dependent
        process.env.NODE_ENV = "test";
        //we start express app here
        require("../server.js");
        const body = { id: testUserStart.id, password: testUserStart.password };
        const result = await axios_1.default.post("/authorize", body, AXIOS_OPTIONS);
        jwtToken = result.data;
        console.log(`JWTToken: ${jwtToken}`);
        headers = { Authorization: `Bearer ${jwtToken}` };
    });
    describe("Server Check", () => {
        it("Check Endpoint /", async () => {
            const result = await axios_1.default.get("/", AXIOS_OPTIONS);
            expect(result.status).toBe(200);
        });
        describe("Authorize & User", () => {
            const testUserNew = {
                id: null,
                first_name: "John",
                last_name: "Doe",
                password: "strongPassword"
            };
            it("Unauthorized - Create User /users (POST) - No JWT", async () => {
                const result = await axios_1.default.post("/users", testUserNew, {
                    baseURL: AXIOS_OPTIONS.baseURL,
                    validateStatus: () => true
                });
                expect(result.status).toBe(401);
            });
            let userCreated;
            it("Create User /users (POST)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.post("/users", testUserNew, axiosConfig);
                userCreated = result.data;
                expect(userCreated.first_name).toBe(testUserNew.first_name);
            });
            it("Show created User /users/:id (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/users/" + userCreated.id, axiosConfig);
                expect(result.data.first_name).toBe(testUserNew.first_name);
            });
            it("Show all Users /users (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/users", axiosConfig);
                const users = result.data;
                expect(users.length > 0).toBeTrue();
            });
            it("Get JWT token for userCreated /authorize (POST)", async () => {
                const body = { id: userCreated.id, password: testUserNew.password };
                const result = await axios_1.default.post("/authorize", body, AXIOS_OPTIONS);
                jwtToken = result.data;
                expect(result.status).toBe(200);
            });
        });
        let productCreated;
        describe("Product", () => {
            const testProduct = {
                id: null,
                name: "Radiator",
                price: 20.2
            };
            it("Create Product /products (POST)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.post("/products", testProduct, axiosConfig);
                productCreated = result.data;
                expect(productCreated.name).toBe(testProduct.name);
            });
            it("Show created Product /products/:id (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/products/" + productCreated.id, axiosConfig);
                expect(result.data.name).toBe(productCreated.name);
            });
            it("Show all Products /products (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/products", axiosConfig);
                const products = result.data;
                expect(products.length > 0).toBeTrue();
            });
        });
        let orderCreated;
        describe("Order", () => {
            const testOrder = {
                id: null,
                user_id: 1,
                status: "active"
            };
            it("Create Order /orders (POST)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.post("/orders", testOrder, axiosConfig);
                orderCreated = result.data;
                expect(orderCreated.user_id).toBe(testOrder.user_id);
            });
            it("Show created Order /orders/:id (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/orders/" + orderCreated.id, axiosConfig);
                expect(result.data.id).toBe(orderCreated.id);
            });
            // orderCreated in the tests before was created by testOrder.user, thus newest order should be the id from orderCreated
            it("Get Current Order by User /orders/users/:id/current (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get(`/orders/users/${testOrder.user_id}/current`, axiosConfig);
                expect(result.data.id).toBe(orderCreated.id);
            });
            it("Show all Order /orders (GET)", async () => {
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.get("/orders", axiosConfig);
                const orders = result.data;
                expect(orders.length > 0).toBeTrue();
            });
            it("Add Product to Order /orders/:id/products/ (POST)", async () => {
                const newProductToOrder = {
                    prodcut_id: 1,
                    quantity: 12
                };
                const axiosConfig = { baseURL: AXIOS_OPTIONS.baseURL, headers: headers };
                const result = await axios_1.default.post(`/orders/${orderCreated.id}/products`, newProductToOrder, axiosConfig);
                expect(result.data.order_id).toBe(orderCreated.id);
            });
        });
    });
    describe("Database Check", () => {
        describe("User", () => {
            const userStore = new users_1.UserStore();
            const testUserNew = {
                id: null,
                first_name: "John",
                last_name: "Doe",
                password: "strongPassword"
            };
            let userCreated;
            it("Create User", async () => {
                userCreated = await userStore.create(testUserNew);
                expect(userCreated.first_name).toBe(testUserNew.first_name);
            });
            it("Show created User", async () => {
                const result = await userStore.show(userCreated.id);
                expect(result.first_name).toBe(testUserNew.first_name);
            });
            it("Index Users", async () => {
                const result = await userStore.index();
                const users = result;
                expect(users.length > 0).toBeTrue();
            });
        });
        let productCreated;
        describe("Product", () => {
            const productStore = new products_1.ProductStore();
            const testProduct = {
                id: null,
                name: "Radiator",
                price: 20.2
            };
            it("Create Product", async () => {
                productCreated = await productStore.create(testProduct);
                expect(productCreated.name).toBe(testProduct.name);
            });
            it("Show created Product", async () => {
                const result = await productStore.show(productCreated.id);
                expect(result.name).toBe(productCreated.name);
            });
            it("Index Products", async () => {
                const products = await productStore.index();
                expect(products.length > 0).toBeTrue();
            });
        });
        let orderCreated;
        describe("Order", () => {
            const orderStore = new orders_1.OrderStore();
            const testOrder = {
                id: null,
                user_id: 1,
                status: "active"
            };
            it("Create Order", async () => {
                orderCreated = await orderStore.create(testOrder);
                expect(orderCreated.user_id).toBe(testOrder.user_id);
            });
            it("Show created Order", async () => {
                const result = await orderStore.show(orderCreated.id);
                expect(result.id).toBe(orderCreated.id);
            });
            it("Index Orders", async () => {
                const orders = await orderStore.index();
                expect(orders.length > 0).toBeTrue();
            });
            // orderCreated in the tests before was created by testOrder.user, thus newest order should be the id from orderCreated
            it("Get Current Order by User", async () => {
                const result = await orderStore.showCurrentByUser(orderCreated.user_id);
                expect(result.id).toBe(orderCreated.id);
            });
            it("Add Product to Order", async () => {
                const newProductToOrder = {
                    prodcut_id: 1,
                    quantity: 12
                };
                const result = await orderStore.addProduct(newProductToOrder.prodcut_id, orderCreated.id, newProductToOrder.quantity);
                expect(result.order_id).toBe(orderCreated.id);
            });
        });
    });
});
