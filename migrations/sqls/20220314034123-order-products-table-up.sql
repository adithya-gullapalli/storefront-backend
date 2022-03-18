CREATE TABLE Order_products (
    id SERIAL PRIMARY KEY,
    order_id bigint REFERENCES Orders(id),
    product_id bigint REFERENCES Products(id),
    quantity integer
);
