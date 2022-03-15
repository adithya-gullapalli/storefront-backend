CREATE TABLE Order_products (
    id INT SERIAL PRIMARY KEY,
    order_id bigint REFERENCES Orders(id),
    product_id bigint REFERENCES Products(id),
    quantity integer
);
INSERT INTO Order_products(order_id, product_id, quantity) VALUES (1, 1, 50);