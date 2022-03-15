CREATE TABLE Orders (
    id INT SERIAL PRIMARY KEY,
    user_id bigint REFERENCES Users(id),
    status VARCHAR(200)
);

INSERT INTO Orders(user_id, status) VALUES(1, 'active');
INSERT INTO Orders(user_id, status) VALUES(1, 'complete');