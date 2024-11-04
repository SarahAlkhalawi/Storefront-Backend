CREATE TABLE products (name VARCHAR(100), price decimal(6,2), id SERIAL PRIMARY KEY);

CREATE TABLE users (firstName VARCHAR(50), lastName VARCHAR(50), password VARCHAR(100), id SERIAL PRIMARY KEY);

CREATE TABLE orders (user_id INTEGER REFERENCES users(id), status VARCHAR(50), id SERIAL PRIMARY KEY);

CREATE TABLE order_products(order_id INTEGER REFERENCES orders(id), product_id INTEGER REFERENCES products(id), quantity INTEGER, id SERIAL PRIMARY KEY);
 

