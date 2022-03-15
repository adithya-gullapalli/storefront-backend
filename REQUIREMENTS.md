# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

#### Products

Index - [GET] - /products 
Show - [GET] - /products/:id 
Create - [POST] - /products [Token Required]

#### Users
Index - [GET] - /users 
Show - [GET] - /users/:id 
Create - [POST] - /users [Token Required]

#### Orders
Index - [GET] - /orders
Show - [GET] - /orders/:id 
Create - [POST] - /orders [Token Required]
|Current Order by user -[GET] - /orders/user/:id/current [Token Required]    
|Add product to order - [POST] - /orders/:id/product [Token Required]

\* assumption latest order is the one with highest orderId 

#### Authenticate

|get JWT Token for user - [GET] - /authorize 


## Data Shapes
#### Product
-  id
- name
- price

#### User
- id
- first_name
- last_name
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)


## Database Tables
#### Products
-  id : int primary key
- name : varchar
- price : real

#### Users
- id : int primary key
- first_name : varchar
- last_name : varchar
- password : varchar

#### Orders
- id :int primary key
- user_id : foreign key
- status of order (active or complete) : varchar

#### Orders-Product
- id : primary key
- order_id: foreign key
- product_id: foreign key
- quantity : integer