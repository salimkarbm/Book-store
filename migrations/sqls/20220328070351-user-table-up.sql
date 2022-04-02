/* Create user table */
CREATE TABLE users (id serial PRIMARY KEY, username varchar(100) NOT NULL,  password_digest varchar(150) NOT NUll);

