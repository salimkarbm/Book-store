/* create order products table */
CREATE TABLE order_products (id serial PRIMARY KEY, quantity integer NOT NULL, order_id BIGINT REFERENCES orders(id), product_id BIGINT REFERENCES products(id));