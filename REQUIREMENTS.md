# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index (Get, "/products")
- Show (Get, "/products/:id")
- Create [token required] (Post, "/products")
- Delete (Delete, '/products/:id')
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required] (Get, "/users")
- Show [token required] (Get, "/users/:id")
- Create N[token required] (Post, "/users")
- Login (Post, "/users/login")

#### Orders
- Current Order by user (args: user id)[token required] (Get, "/orders/user/:userId")
- Index (Get, "/orders")
- Show (Get, "/orders/:id")
- Create  (Post, "/orders")
- Delete (Delete, '/orders/:id')
- addProduct (Post, "/orders/:id/product")
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category
  
```sql
CREATE TABLE products (name VARCHAR(100), price decimal(6,2), id SERIAL PRIMARY KEY);
```

#### User
- id
- firstName
- lastName
- password
  
```sql
CREATE TABLE users (firstName VARCHAR(50), lastName VARCHAR(50), password VARCHAR(100), id SERIAL PRIMARY KEY);
```

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```sql
CREATE TABLE orders (user_id INTEGER REFERENCES users(id), status VARCHAR(50), id SERIAL PRIMARY KEY);

CREATE TABLE order_products(order_id INTEGER REFERENCES orders(id), product_id INTEGER REFERENCES products(id), quantity INTEGER, id SERIAL PRIMARY KEY);
```
 
