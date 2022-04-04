/*create orders table*/
CREATE TABLE orders (id serial PRIMARY KEY, status VARCHAR(64), user_id BIGINT REFERENCES users(id));