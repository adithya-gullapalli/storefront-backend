CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id bigint REFERENCES Users(id),
    status VARCHAR(200)
);
