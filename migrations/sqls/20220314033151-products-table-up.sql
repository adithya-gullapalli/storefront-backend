CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price real
);

INSERT INTO Products(name, price) VALUES('SmartMeter', 1337.2);
