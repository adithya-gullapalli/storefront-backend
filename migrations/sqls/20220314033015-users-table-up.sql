CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100)
);

INTO Users(first_name, last_name, password) VALUES ('Hannes', 'Roth', '$2b$10$5sYpcJRckiAvixaXOD7jU..qOs53ub/iCXxw/GpW3RgVWHNvR6Kci');
