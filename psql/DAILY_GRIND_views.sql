


--CREATING  TABLES

CREATE TABLE cities (
  city_id            INTEGER       PRIMARY KEY,
  city_name          VARCHAR(100),
  delivery_surcharge DECIMAL(6,2)
);

-- ----------------------------------------------------------------

CREATE TABLE addresses (
  address_id   SERIAL       PRIMARY KEY,
  street_line1 VARCHAR(200) NOT NULL,
  street_line2 VARCHAR(200),
  label        VARCHAR(50),
  city_id      INT          NOT NULL
               REFERENCES cities(city_id)
);

-- ----------------------------------------------------------------

CREATE TABLE customers (
  customer_id        SERIAL       PRIMARY KEY,
  full_name          VARCHAR(200),
  email              VARCHAR(200) NOT NULL UNIQUE,
  phone              VARCHAR(20),
  default_address_id INT
                     REFERENCES addresses(address_id)
);

-- ----------------------------------------------------------------

CREATE TABLE categories (
  category_id   SERIAL       PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT
);

-- ----------------------------------------------------------------

CREATE TABLE products (
  product_id   SERIAL        PRIMARY KEY,
  product_name VARCHAR(150)  NOT NULL,
  price        DECIMAL(8,2)  NOT NULL CHECK (price >= 0),
  stock_level  INT           NOT NULL DEFAULT 0
                             CHECK (stock_level >= 0),
  category_id  INT           NOT NULL
               REFERENCES categories(category_id)
);

-- ---------------------------------------------------------

CREATE TABLE orders (
  order_id            SERIAL        PRIMARY KEY,
  customer_id         INT           NOT NULL
                      REFERENCES customers(customer_id),
  delivery_address_id INT
                      REFERENCES addresses(address_id),
  ordered_at          TIMESTAMP     NOT NULL DEFAULT NOW(),
  total_amount        DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  order_type          VARCHAR(20)   NOT NULL DEFAULT 'in-store'
                      CHECK (order_type IN ('in-store', 'online'))
);
ALTER TABLE orders
DROP COLUMN order_type;

CREATE TYPE order_kind AS ENUM('in-store','online');

ALTER TABLE orders
ADD order_type order_kind;

UPDATE orders
SET order_type = 'online'
WHERE order_id IN (1,3);

UPDATE orders
SET order_type = 'in-store'
WHERE order_id IN (2,4);

CREATE TYPE order_status_kind AS ENUM (
    'pending',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled'
);

UPDATE orders
SET order_status = 'delivered'
WHERE order_id = 1;

UPDATE orders
SET order_status = 'ready'
WHERE order_id = 2;

UPDATE orders
SET order_status = 'out_for_delivery'
WHERE order_id = 3;

UPDATE orders
SET order_status = 'preparing'
WHERE order_id = 4;



ALTER TABLE orders
ADD order_status order_status_kind;

-- ----------------------------------------------------------------

CREATE TABLE order_items (
  item_id    SERIAL       PRIMARY KEY,
  order_id   INT          NOT NULL
             REFERENCES orders(order_id),
  product_id INT          NOT NULL
             REFERENCES products(product_id),
  quantity   INT          NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(8,2) NOT NULL CHECK (unit_price >= 0)
);


--insertion

-- 1. CITIES
INSERT INTO cities (city_id, city_name, delivery_surcharge) VALUES
  (1, 'Mumbai',    0.00),
  (2, 'Pune',      2.50),
  (3, 'Hyderabad', 1.75),
  (4, 'Bangalore', 3.00);

-- 2. ADDRESSES
INSERT INTO addresses (street_line1, street_line2, label, city_id) VALUES
  ('12 JP Road',    NULL,       'Home', 1),
  ('88 AB Nagar',   'Apt 4B',   'Work', 1),
  ('45 NS Colony',  NULL,       'Home', 2),
  ('200 MN House',  'Suite 10', 'Work', 3);

-- 3. CUSTOMERS  (Abhinav = 1, Aryan = 2)
INSERT INTO customers (full_name, email, phone, default_address_id) VALUES
  ('Abhinav Jaiswal', 'abhinav@email.com', '9876543210', 1),
  ('Aryan Sharma',    'aryan@email.com',   '9123456780', 2),
  ('Jason Rodrigues', 'jason@email.com',   '8001112222', 3),
  ('Placido Fernandes','placido@email.com', NULL,        4);

-- 4. CATEGORIES
INSERT INTO categories (category_name, description) VALUES
  ('Drinks',      'Hot and cold beverages including espresso and teas'),
  ('Food',        'Freshly baked pastries and light snacks'),
  ('Merchandise', 'Branded cups, tumblers, and coffee accessories'),
  ('Beans',       'Bagged artisanal single-origin and blended coffee beans');

-- 5. PRODUCTS
INSERT INTO products (product_name, price, stock_level, category_id) VALUES
  ('Oat Milk Latte',         5.50,  100, 1),
  ('Cold Brew',              4.75,   80, 1),
  ('Blueberry Scone',        3.25,   40, 2),
  ('Almond Croissant',       3.75,   30, 2),
  ('Espresso Blend Bag',    18.00,   25, 4),
  ('Daily Grind Tumbler',   24.99,   15, 3);
  INSERT INTO products (product_name, price, stock_level, category_id) VALUES
  ('a',6.8,20,null)

-- 6. ORDERS
--    order_type values: 'in-store'  OR  'online'  (your updated CHECK)
INSERT INTO orders (customer_id, delivery_address_id, total_amount, order_type) VALUES
  (1, 1,    8.75,  'online'),    -- Abhinav  ordered online, delivery to address 1
  (2, NULL, 8.50,  'in-store'),  -- Aryan    walked in, no delivery address
  (3, 3,    23.50, 'online'),    -- Jason    ordered online, delivery to address 3
  (4, NULL, 24.99, 'in-store');  -- Placido  walked in, bought a tumbler

-- 7. ORDER_ITEMS
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  -- Abhinav's online order  (order 1): Oat Milk Latte + Blueberry Scone
  (1, 1, 1, 5.50),
  (1, 3, 1, 3.25),

  -- Aryan's in-store order  (order 2): Cold Brew + Almond Croissant
  (2, 2, 1, 4.75),
  (2, 4, 1, 3.75),

  -- Jason's online order    (order 3): Espresso Bag + Oat Milk Latte
  (3, 5, 1, 18.00),
  (3, 1, 1,  5.50),

  -- Placido's in-store order(order 4): Daily Grind Tumbler x1
  (4, 6, 1, 24.99);


-- sHOW TABLES

SELECT * FROM cities;
SELECT * FROM addresses;
SELECT * FROM customers;
SELECT * FROM categories;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_items;


-- 1. Add tags ARRAY to products
ALTER TABLE products
  ADD COLUMN tags TEXT[];

-- Tags for products
UPDATE products SET tags = ARRAY['vegan','gluten-free']          WHERE product_id=1;
UPDATE products SET tags = ARRAY['vegan','dairy-free']           WHERE product_id=2;
UPDATE products SET tags = ARRAY['contains-eggs','contains-nuts'] WHERE product_id=3;
UPDATE products SET tags = ARRAY['contains-eggs','contains-dairy'] WHERE product_id=4;
UPDATE products SET tags = ARRAY['vegan','gluten-free']          WHERE product_id=5;
UPDATE products SET tags = ARRAY['merchandise']                WHERE product_id=6;

SELECT * FROM products;

-- Access by index (STARTS AT 1, not 0 !)
Select tags[1] from products;

-- Accesing those products which have tags vegan or merchandise
Select * from products where tags @> ARRAY['vegan'] OR tags @> ARRAY['merchandise'];

-- Find products that contain a specific tag
select * from products where tags @> ARRAY['contains-eggs'];

select * from products
where 'contains-eggs'=ANY(tags);

-- How many tags does each product have?
SELECT product_name, array_length(tags, 1) AS tag_count
FROM products;

-- Expand array into separate rows (useful for reporting)
SELECT product_name, unnest(tags) AS tag
FROM products;

-- Replace the whole array
UPDATE products
SET tags = ARRAY['vegan', 'nut-free', 'gluten-free']
WHERE product_id = 1;

-- Update a single element by index
UPDATE products
SET tags[1] = 'plant-based'    -- change first tag only
WHERE product_id = 1;

-- Append one element to existing array
UPDATE products
SET tags = array_append(tags, 'staff-pick')
WHERE product_id = 2;

-- Remove one element from array
UPDATE products
SET tags = array_remove(tags, 'contains-nuts')
WHERE product_id = 3;


	


-- 2. Add favourite_drinks ARRAY to customers
ALTER TABLE customers
  ADD COLUMN favourite_drinks TEXT[];

-- Favourite drinks for customers
UPDATE customers SET favourite_drinks=ARRAY['Oat Milk Latte','Cold Brew']      WHERE customer_id=1;
UPDATE customers SET favourite_drinks=ARRAY['Cold Brew','Blueberry Scone']    WHERE customer_id=2;
UPDATE customers SET favourite_drinks=ARRAY['Espresso Blend Bag']             WHERE customer_id=3;


--Add JSONB columns to existing tables
ALTER TABLE orders
  ADD COLUMN delivery_notes JSONB;

ALTER TABLE order_items
  ADD COLUMN customization JSONB;

-- Delivery notes (only for online orders)
UPDATE orders
SET delivery_notes = '{"instruction":"Leave at door","ring_bell":true,"floor":2}'::JSONB
WHERE order_id=1;

UPDATE orders
SET delivery_notes = '{"instruction":"Call on arrival","ring_bell":false,"floor":1}'::JSONB
WHERE order_id=3;

-- Customization for order items
UPDATE order_items
SET customization = '{"milk":"oat","shots":2,"size":"large","syrup":["vanilla"]}'::JSONB
WHERE item_id=1;

UPDATE order_items
SET customization = '{"milk":"whole","shots":1,"size":"medium","temperature":"iced"}'::JSONB
WHERE item_id=3;


-- Get full JSON column
SELECT delivery_notes FROM orders WHERE order_id = 1;

-- Extract a field → returns JSON type
SELECT delivery_notes -> 'instruction' FROM orders;
-- Result: "Leave at door"   (with quotes)

-- Extract a field → returns TEXT (no quotes)
SELECT delivery_notes ->> 'instruction' FROM orders;
-- Result: Leave at door   (plain text)

-- Nested key access  (floor inside the object)
SELECT delivery_notes -> 'floor' FROM orders;


-- Filter rows where a JSON key has a specific value
SELECT order_id FROM orders
WHERE delivery_notes ->> 'instruction' = 'Leave at door';

-- Check if a key exists
SELECT order_id FROM orders
WHERE delivery_notes ? 'ring_bell';



-------------------------------------------------------------------------------------------------------------------------------------------------
  --Queries Task

  --Q1. Display Order ID and Delivery Type for all orders.
  SELECT * FROM orders;
  select order_id,order_type from orders;

  --Q2. Display Order ID and Building Name for all apartment deliveries.
  SELECT * FROM orders;
  SELECT * FROM addresses;
  
  select order_id,street_line1
  from addresses as t1
  JOIN orders as t2
  on t1.address_id=t2.delivery_address_id;

 update addresses
 set street_line2='jm 10'
 where address_id=1;

 
 update addresses
 set street_line2='Dm 10'
 where address_id=3;
 
  select t2.order_id,CONCAT(t1.street_line1,' ',t1.street_line2) AS full_address
  from addresses as t1
  JOIN orders as t2
  on t1.address_id=t2.delivery_address_id;

--Q3. Display Order ID and Company Name for all office deliveries.
SELECT * FROM orders;
SELECT * FROM addresses;


select  t1.order_id,CONCAT(t2.street_line1,'',t2.street_line2)
from orders t1
JOIN addresses t2
on t1.delivery_address_id=t2.address_id
where t2.label='Work';

--Q4. Display all orders that were delivered to apartments.
SELECT * FROM orders;
SELECT * FROM addresses;

select * from orders where order_type='online' AND order_status='delivered';

--Q5. Display all orders that were delivered to offices.
SELECT * FROM orders;
SELECT * FROM addresses;

update orders
set delivery_address_id=1
where order_id=1;

update orders
set delivery_address_id=4
where order_id=4;

update orders
set delivery_address_id=2
where order_id=2;

select t1.* from orders t1
join addresses t2
on t1.delivery_address_id=t2.address_id
where label='Work';

--Q6. Display all orders where the customer requested "leave_at_door = true".
select * from orders;
select delivery_notes ->> 'instruction'='Leave at door' from customers t1
join orders t2
on t1.customer_id=t2.customer_id;

--Q7. Display all orders that contain a gate code.
--(Hint: Check whether a JSON key exists.)
select * from orders;

UPDATE orders
SET delivery_notes = '{"instruction":"Ring bell twice","ring_bell":true ,"gate_code":3}'::JSONB
WHERE order_id = 2;

UPDATE orders
SET delivery_notes = jsonb_set(
  delivery_notes,
  '{gate_code}',          -- key path
  '9'::JSONB,          -- new value
  true                  -- create if not exists
)
WHERE order_id = 1;

select * from orders 
where delivery_notes ? 'gate_code';

--Q8. Display all orders that contain a preferred delivery time.
UPDATE orders
SET delivery_notes = jsonb_set(
     delivery_notes,
    '{preferred_delivery_time}',
    '"18:00"'
)
WHERE order_id = 1;

UPDATE orders
SET delivery_notes = jsonb_set(
    delivery_notes,
    '{preferred_delivery_time}',
    '"20:00"'
)
WHERE order_id = 3;
select * from orders;

select * from orders
where delivery_notes?'preferred_delivery_time';

--Q9. Display all orders that contain a contact person.
select * from orders;
UPDATE orders
SET delivery_notes = jsonb_set(
    delivery_notes,
    '{contact_person}',
    '"Rahul"'
)
WHERE order_id = 1;

UPDATE orders
SET delivery_notes = jsonb_set(
    delivery_notes,
    '{contact_person}',
    '"Amit"'
)
WHERE order_id = 2;

select * from orders
where delivery_notes ? 'contact_person';

-----------------------------------------------------------------------------------------------------------------------------------------

--Q1. Find the total number of products available.
select count(*) As Total_no_of_products from products;

--Q2. Find the total number of customers registered.
SELECT * FROM customers;
select count(*) As Total_no_of_customers from customers;

--Q3. Find the total number of orders placed.
Select count(*) from orders;

--Q4. Find the total number of categories available.
Select count(*) from categories;

--Q5. Find the average price of all products.
select * from products;
select AVG(price) As Average_price
from products;

--Q6. Find the highest product price.
Select MAX(price) as Highest_price
from products;

--Q7. Find the lowest product price.
Select MIN(price) as lowest_price
from products;

--Q8. Find the total stock available across all products.
select * from products
where stock_level>0;

--Q9. Find the average stock available per product.
SELECT AVG(stock_level) AS avg_stock_per_product
FROM products;

--Q10. Find the total quantity sold across all order items.
select * from orders;
select * from products;

SELECT * FROM order_items;
select sum(quantity) As total_quantity from  order_items;

--Q11. Find the highest quantity ordered in a single order item.
update order_items
set quantity=20
where item_id=1;

SELECT * FROM order_items;

SELECT MAX(quantity) from order_items;

--Q12. Find the lowest quantity ordered in a single order item.

SELECT MIN(quantity) from order_items;
SELECT * FROM order_items
where quantity>=(SELECT MIN(quantity) from order_items);

--Q13. Find the total revenue generated assuming revenue = Price × Quantity.
select * from products;

SELECT * FROM order_items;
select sum(quantity*unit_price) AS Total_Revenue from order_items;

--Q14. Find the average quantity ordered per order item.
SELECT AVG(quantity) AS avg_quantity_per_order_item
FROM order_items;

--Q15. Find the total number of orders placed after 1st June 2025
select * from orders;
select count(*) from orders
where ordered_at>'2026-06-01';

--Q16. Find the total number of products with stock greater than 50.
select count(*) from products
where stock_level>50;

--Q17. Find the average product price for products costing more than ₹5.
select AVG(price) from products
where stock_level>5;

--Q18. Find the total stock value (Price × Stock) of all products.
select * from products;
select Sum(price*stock_level) from products;

--Q19. Find the total number of customers who have placed orders.
Select count(customer_id) from orders;

--Q20. Find the difference between the highest and lowest product price.
Select MAX(price)-Min(price) AS DIFF from products;
-------------------------------------------------------------------------------------------------------------------------------------------------

-- Q1. Display Product Name along with Category Name.
Select * from products;
Select * from categories;

select t1.product_name,t2.category_name
from products t1
join categories t2
on t1.category_id=t2.category_id;

--Q2. Display Customer Name along with City Name.
select * from customers;
select * from addresses;
Select * from cities;

select t1.full_name,t3.city_name
from customers t1
join addresses t2
on t1.default_address_id=t2.address_id
join cities t3
on t2.city_id=t3.city_id;

--Q3. Display Customer Name and Order Date.
select * from customers
select * from orders;

select t1.full_name,t2.ordered_at
from customers t1
join orders t2
on t1.customer_id=t2.customer_id;

--Q4. Display Order ID and Customer Name.
select * from customers;
select * from orders;

select t1.order_id,t2.full_name
from orders t1
join customers t2
on t1.customer_id=t2.customer_id;

--Q5. Display Product Name and Quantity Ordered.
select * from products;
select * from orders;
select * from order_items;

select t1.product_name,t2.quantity
from products t1
join order_items t2
on t1.product_id=t2.product_id;

--Q6. Display Order ID, Product Name, and Quantity Ordered.
select * from products;
select * from orders;
select * from order_items;

select t1.order_id,t3.product_name,t2.quantity
from orders t1
join order_items t2
on t1.order_id=t2.order_id
join products t3
on t2.product_id=t3.product_id;

--Q7. Display Customer Name, Order ID, and Order Date.
select * from customers;
select * from orders;

select t1.full_name,t2.order_id,t2.ordered_at
from customers t1
join orders t2 
on t1.customer_id=t2.customer_id;

--Q8. Display Customer Name and the products they ordered.


select t1.full_name,t4.product_name
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
join products t4
on t3.product_id=t4.product_id;

--Q9. Display Category Name and Product Name.
select t1.product_name,t2.category_name
from products t1
join categories t2
on t1.category_id=t2.category_id;

--Q10. Display Customer Name, City Name, and Order Date.
select * from addresses;
select * from customers;

select t3.full_name,t1.city_name,t4.ordered_at
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id;

-- Q11. Display Order ID, Customer Name, Product Name, and Quantity.
select t2.order_id,t1.full_name,t4.product_name,t3.quantity
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
join products t4
on t3.product_id=t4.product_id;

--12 Display Product Name, Category Name, and Price.
select * from products;
select * from categories;


select t1.product_name,t1.price,t2.category_name
from products t1
join categories t2
on t1.category_id=t2.category_id;

--Q13. Display Customer Name and total products ordered in each order.
select * from customers;
select * from orders;
select * from order_items;

select t2.order_id,t1.full_name,count(t3.*) as total_products_ordered
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
group by t2.order_id,t1.full_name,t3.order_id;

--Q14. Display all products along with their categories sorted by category name.
select * from categories;
select * from products;

select t1.product_name,t2.category_name
from products t1
join categories t2
on t1.category_id=t2.category_id
order by t2.category_name;

--Q15. Display all customers and their addresses.
select * from customers;
select * from addresses;


select t1.full_name,t2.street_line1,t2.street_line2
from customers t1
join addresses t2
on t1.default_address_id=t2.address_id;

--Q16. Display all orders along with customer and address information.
select t1.full_name,t2.street_line1,t2.street_line2,t3.order_id
from customers t1
join addresses t2
on t1.default_address_id=t2.address_id
join orders t3
on t1.customer_id=t3.customer_id
order by t3.order_id;

--Q17. Display all products purchased by customers from a particular city.
select t6.product_name,t1.city_name
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id
join order_items t5
on t4.order_id=t5.order_id
join products t6
on t5.product_id=t6.product_id;

--Q18. Display Customer Name, Product Name, Quantity, and Order Date.
select t3.full_name,t6.product_name,t5.quantity,t4.ordered_at
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id
join order_items t5
on t4.order_id=t5.order_id
join products t6
on t5.product_id=t6.product_id;

-- Q19. Generate a detailed sales report showing:Order ID Customer Name Product Name Quantity Price
select t4.order_id,t3.full_name,t6.product_name,t5.quantity
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id
join order_items t5
on t4.order_id=t5.order_id
join products t6
on t5.product_id=t6.product_id;

-- Q20. Generate a complete order report showing: Order ID,Customer Name,City Name,Product Name,Quantity Ordered,Order Date
select t4.order_id,t3.full_name,t1.city_name,t6.product_name,t5.quantity,t4.ordered_at
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id
join order_items t5
on t4.order_id=t5.order_id
join products t6
on t5.product_id=t6.product_id;

select t2.full_name,count(t3.order_id)
from addresses t1
join customers t2
on t1.address_id=t2.default_address_id
join orders t3
on t2.customer_id=t3.customer_id
where t1.label='Home'
group by t2.full_name;

select * from addresses;

----------------------------------------------------------------------------------------------------------------------------------------
--Q1. Find the number of products in each category.
select t7.category_name,count(*) AS number_of_products
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
join orders t4
on t3.customer_id=t4.customer_id
join order_items t5
on t4.order_id=t5.order_id
join products t6
on t5.product_id=t6.product_id
join categories t7
on t6.category_id=t7.category_id
group by t7.category_name;

--Q2. Find the number of customers in each city.
select t1.city_name,count(t3.customer_id)
from cities t1
join addresses t2
on t1.city_id=t2.city_id
join customers t3
on t2.address_id=t3.default_address_id
group by t1.city_name;

--Q3. Find the number of orders placed by each customer.
select t1.full_name,count(order_id)
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
group by t1.full_name;

--Q4. Find the average product price for each category.
select * from products;
SELECT t1.category_name,avg(price)
FROM categories t1
JOIN products t2
ON t1.category_id = t2.category_id
GROUP BY t1.category_name;

-- Q5. Find the total stock available in each category.
SELECT c.category_name,
       SUM(p.stock_level) AS total_stock
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q6. Find the total quantity sold for each product.
SELECT p.product_name,
       SUM(oi.quantity) AS total_quantity_sold
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY p.product_name;

-- Q7. Find the total revenue generated by each product.
SELECT p.product_name,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY p.product_name;

-- Q8. Find the total number of products available under each category.
SELECT c.category_name,
       COUNT(p.product_id) AS total_products
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q9. Find the average stock available in each category.
SELECT c.category_name,
       AVG(p.stock_level) AS avg_stock
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q10. Find the total orders placed from each city.
SELECT ci.city_name,
       COUNT(o.order_id) AS total_orders
FROM cities ci
JOIN addresses a
ON ci.city_id = a.city_id
JOIN customers c
ON a.address_id = c.default_address_id
JOIN orders o
ON c.customer_id = o.customer_id
GROUP BY ci.city_name;

-- Q11. Find the highest-priced product in each category.
SELECT c.category_name,
       MAX(p.price) AS highest_price
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q12. Find the lowest-priced product in each category.
SELECT c.category_name,
       MIN(p.price) AS lowest_price
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q13. Find the total quantity ordered by each customer.
SELECT c.full_name,
       SUM(oi.quantity) AS total_quantity_ordered
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
JOIN order_items oi
ON o.order_id = oi.order_id
GROUP BY c.full_name;

-- Q14. Find the total revenue generated by each customer.
SELECT c.full_name,
       SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
JOIN order_items oi
ON o.order_id = oi.order_id
GROUP BY c.full_name;

-- Q15. Find the average quantity ordered for each product.
SELECT p.product_name,
       AVG(oi.quantity) AS avg_quantity
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY p.product_name;

-- Q16. Find the total stock value (Price × Stock) for each category.
SELECT c.category_name,
       SUM(p.price * p.stock_level) AS stock_value
FROM categories c
JOIN products p
ON c.category_id = p.category_id
GROUP BY c.category_name;

-- Q17. Find the total number of distinct products ordered by each customer.
SELECT c.full_name,
       COUNT(DISTINCT oi.product_id) AS distinct_products
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
JOIN order_items oi
ON o.order_id = oi.order_id
GROUP BY c.full_name;

-- Q18. Find the total quantity sold in each category.
SELECT c.category_name,
       SUM(oi.quantity) AS total_quantity_sold
FROM categories c
JOIN products p
ON c.category_id = p.category_id
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY c.category_name;

-- Q19. Find the number of customers who placed orders in each city.
SELECT ci.city_name,
       COUNT(DISTINCT cu.customer_id) AS customer_count
FROM cities ci
JOIN addresses a
ON ci.city_id = a.city_id
JOIN customers cu
ON a.address_id = cu.default_address_id
JOIN orders o
ON cu.customer_id = o.customer_id
GROUP BY ci.city_name;

-- Q20. Find the total revenue generated for each category and display the results in descending order.
SELECT c.category_name,
       SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p
ON c.category_id = p.category_id
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY c.category_name
ORDER BY total_revenue DESC;

-------------------------------------------------------------------------------------------------------------------------------------------

--Having Clauses

--1. Show categories having more than 2 products

Select distinct t1.category_name
from categories t1
join products t2
on t1.category_id=t2.category_id;

Select  t1.category_name,count(t1.category_id)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_name;

Select  t1.category_name,count(t1.category_id)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_name
having count(t1.category_id)>1;

--2. Find customers who placed more than 2 orders.
select * from customers;
select * from orders;

INSERT INTO orders
(order_id, customer_id, delivery_address_id, ordered_at, total_amount, order_status, order_type)
VALUES
(5, 1, 1, NOW(), 12.50, 'ready', 'online'),
(6, 1, 1, NOW(), 15.00, 'delivered', 'online'),
(7, 2, 2, NOW(), 20.00, 'preparing', 'in-store');

select t1.full_name,count(*)
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
group by t1.full_name,t1.customer_id;

select t1.full_name,count(*)
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
group by t1.full_name,t1.customer_id
having count(*)>2;

--3. Find products whose total quantity sold is greater than 5.
select * from products;
select * from orders;
select * from order_items;

select t3.product_name,sum(t2.quantity)
from orders t1
join order_items t2
on t1.order_id=t2.order_id
join products t3
on t2.product_id=t3.product_id
group by t3.product_id,t3.product_name
having sum(t2.quantity) >5;

---4. Find cities having more than 1 customer.

SELECT ci.city_name,
       COUNT(DISTINCT cu.customer_id) AS customer_count
FROM cities ci
JOIN addresses a
ON ci.city_id = a.city_id
JOIN customers cu
ON a.address_id = cu.default_address_id
JOIN orders o
ON cu.customer_id = o.customer_id
GROUP BY ci.city_name
having COUNT(DISTINCT cu.customer_id)>1;

--5. Find categories where average price is greater than 200.
select t1.category_name,AVG(price)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_id,t1.category_name;

select t1.category_name,AVG(price)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_id,t1.category_name
having AVG(price)>20;

--6. Find products whose total revenue is above 1000. 
select * from products;

SELECT c.category_name,
       SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p
ON c.category_id = p.category_id
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY c.category_name;

SELECT c.category_name,
       SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p
ON c.category_id = p.category_id
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY c.category_name
having SUM(oi.quantity * oi.unit_price)>100 ;

select t1.category_name,Count(t2.product_id)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_name,t1.category_id;

---------------------------------------------------------------------------------------

--Self JOIN

create table Employee(
EmployeeId serial primary key,
EmployeeName varchar(20),
Role varchar(15),
ManagerId Integer references Employee(EmployeeId)
);

INSERT into Employee(EmployeeName,Role,ManagerId) values
('Aarav Mehta','Owner',NULL),
('Neha Kapoor','Op. Manager',1),
('Rohan Iyer','Branch Mgr',2),
('Sneha Shah','Branch Mgr',2),
('Kabir Joshi ','Head Barista',3),
('Meera Nair','Head Barista',4),
('Pooja Desai','Delivery Sup',2),
('Vikram Rao','Cashier',3),
('Arjun Patel','Delivery Ex.',8),
('Isha Varma','Barista',5);


Select e.EmployeeId,e.EmployeeName,e.Role,e.ManagerId,m.EmployeeName As Manager
from Employee e left outer join Employee as m
on e.ManagerId=m.EmployeeId;

--------------------------------------------------------------------------
---CASE STATEMENTS
 --3.1 Display ProductName, Price, and a PriceLabel:
--below ₹5 → Low Price
---₹5 to ₹10 → Medium Price
--above ₹10 → High Price
select * from products;

select product_name,price,
	   CASE 
	   	when price <5 then 'Low Price'
		when price between 5 and 10 then 'Medium Price'
		else 'high price'
	   END As PriceLabel
from products;


--3.2 Display ProductName, Price, and DiscountEligibility:
---Eligible if price > 250
---Not Eligible otherwise

select product_name,price,
	   CASE 
	   	when price >10 then 'eligible'
		else 'not eligible'
	   END As DiscountEligibility
from products;

--3.3 Display ProductName, Price, and TaxCategory:
--if price < 5 → 5% Tax Slab
--if price between 5 and 10 → 12% Tax Slab
--if price > 10 → 18% Tax Slab

select product_name,price,
	   CASE 
	   	when price <5 then '5% Tax Slab'
		when price between 5 and 10 then '12% Tax Slab'
		else '18% Tax Slab'
	   END As TaxCategory
from products;

--3.4 Display ProductName, Stock, and RestockFlag:
--stock < 10 → Restock Needed
--otherwise → Sufficient Stock

select * from products;

select product_name,stock_level,
	   CASE 
	   	when stock_level <20 then 'Restock Needed'
		else 'Sufficient Stock'
	   END As RestockFlag
from products;

--3.5       Display ProductName, Stock, and InventoryLevel:
---below 5 → Critical
---5–15 → Warning
---above 15 → Safe

select product_name,stock_level,
	   CASE 
	   	when stock_level <20 then 'Critical'
		when stock_level between 20 and 60 then 'Warning'
		else 'safe'
	   END As InventoryLevel
from products;


 --3.6 Display ProductName, Price, Stock, and a new column InventoryValueBand based on Price * Stock:
---below 1000 → Low Value
---1000 to 5000 → Medium Value
---above 5000 → High Value


select product_name,price,stock_level,price*stock_level AS InventoryValue ,
	   CASE 
	   	when price*stock_level <200 then 'Low Value'
		when price*stock_level between 200 and 400 then 'Medium value'
		else 'high value'
	   END As InventoryValueBand
from products;

--3.7 Display CustomerName, Email, and classify email provider as:
	--Gmail
	--Yahoo
	--Other

select * from customers;

UPDATE customers
SET email = 'abhinav@gmail.com'
WHERE customer_id = 1;

UPDATE customers
SET email = 'aryan@yahoo.com'
WHERE customer_id = 2;

UPDATE customers
SET email = 'jason@outlook.com'
WHERE customer_id = 3;

UPDATE customers
SET email = 'placido@gmail.com'
WHERE customer_id = 4;

select full_name,email,
		case 
		  when email like '%@gmail.com' then 'Gmail'
		  when email like '%@yahoo.com' then 'Yahoo'
		  else 'Other'
		end  email_provider
from customers;

--3.8 Display CustomerName, Phone, and PhoneStatus:
	--if phone is NULL → Missing
	--otherwise → Available

select * from customers;

select full_name,phone,
		case
			--when phone=NULL then 'Missing'   NULL cannot be compared using = or !=.
			when phone is null then 'Missing'
			else 'Available'
		end PhoneStatus
from customers;


--3.11 Display OrderId, OrderDate, and classify order into:
	--Weekday Order
	--Weekend Order

select * from orders;

select order_id,ordered_at,
		case 
			when EXTRACT(DOW from ordered_at ) IN (0,6) then 'weekend order'
			else 'weekday order'
		end as classify_order
from orders;

UPDATE orders
SET ordered_at = '2026-06-20 10:00:00'
WHERE order_id = 5;

UPDATE orders
SET ordered_at = '2026-06-21 15:30:00'
WHERE order_id = 6;


--3.12 Display OrderId, OrderDate, and classify the order time into:
	--Morning
	--Afternoon
	--Evening
	--Night

UPDATE orders
SET ordered_at = '2026-06-20 08:30:00'
WHERE order_id = 1;   -- Morning

UPDATE orders
SET ordered_at = '2026-06-20 14:15:00'
WHERE order_id = 2;   -- Afternoon

UPDATE orders
SET ordered_at = '2026-06-21 18:45:00'
WHERE order_id = 3;   -- Evening

UPDATE orders
SET ordered_at = '2026-06-21 22:30:00'
WHERE order_id = 4;   -- Night

UPDATE orders
SET ordered_at = '2026-06-22 09:00:00'
WHERE order_id = 5;   -- Morning

UPDATE orders
SET ordered_at = '2026-06-22 15:30:00'
WHERE order_id = 6;   -- Afternoon

UPDATE orders
SET ordered_at = '2026-06-22 19:15:00'
WHERE order_id = 7;   -- Evening

select order_id,ordered_at,
		case 
			when EXTRACT(HOUR from ordered_at ) BETWEEN 6 AND 11 then 'Morning'
			when EXTRACT(HOUR from ordered_at ) BETWEEN 12 AND 16 then 'Afternoon'
			when EXTRACT(HOUR from ordered_at ) BETWEEN 17 AND 20 then 'Evening'
			else 'Night'
		end as classify_order
from orders;

--3.13 Display OrderId, OrderDate, and classify orders as:
	--Recent Order if placed in the last 7 days
	--Old Order otherwise

UPDATE orders
SET ordered_at = '2026-06-10 10:00:00'
WHERE order_id = 1;

select order_id,ordered_at,
		case 
			when ordered_at >= CURRENT_DATE -INTERVAL '7 days' THEN 'Recent Order'
			else 'Old Order'
		end as classify_order
from orders;

--3.14 Display OrderId, ProductId, Quantity, PriceAtPurchase, and LineValueCategory based on Quantity * PriceAtPurchase:
	--below 200 → Small Sale
	--200 to 500 → Medium Sale
	--above 500 → Large Sale

select *  from order_items;

select order_id,product_id,quantity,unit_price,quantity*unit_price AS LineValue,
		case 
			when quantity*unit_price<10 then 'Small sale'
			when quantity*unit_price BETWEEN 10 AND 100 then 'Medium sale'
			ELSE 'Large Sale'
		END AS LineValueCategory
from order_items;
			
--3.15 Display:
	--OrderId
	--total number of items in the order
	--OrderSize
	--where:
	--1 item → Small Order
	--2–4 → Medium Order
	--4 → Large Order
	
select * from order_items;
select * from orders;

select t1.order_id,count(t2.item_id) AS Total_no_order,
	case 
		when count(t2.item_id)=1 then 'Small Order'
		when count(t2.item_id) BETWEEN 2 AND 4 then 'Medium Order'
		ELSE 'Large Order'
	end AS Order_Size		
from orders t1
join order_items t2
on t1.order_id=t2.order_id
group by t1.order_id;

--3.16 Display:
	--OrderId
	--total order value
	--OrderValueCategory
	--where:
		--below 200 → Low Value
		--200–500 → Medium Value
		--above 500 → High Value

select * from orders;
select * from order_items;

select t1.order_id,sum(t2.quantity*t2.unit_price) AS Toatl_order_value,
	case 
		when sum(t2.quantity*t2.unit_price)<10 then 'Low Value'
		when sum(t2.quantity*t2.unit_price) BETWEEN 10 AND 100 then 'Medium Value'
		ELSE 'High Value'
	END AS OrderValueCategory
from orders t1
join order_items t2
on t1.order_id=t2.order_id
group by t1.order_id;

3.17 Display:
	--CustomerName
	--average order value
	--AOVBand
		--where:
		--low average → Budget Buyer
		--medium average → Regular Buyer
		--high average → Premium Buyer

select t1.full_name,round(AVG(t3.quantity*t3.unit_price),2),
	case 
		when round(AVG(t3.quantity*t3.unit_price),2)<10 then 'Budget Buyer'
		when round(AVG(t3.quantity*t3.unit_price),2) between 10 and 30  then 'Regular Buyer'
		ELSE 'Premium buyer'
	end as AOVBand
from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
group by t1.full_name,t1.customer_id;

--3.18 Generate a single report showing:
	--total delivery orders
	--total in-store orders

select * from addresses;
select * from customers;
select * from orders;

select 
	count(case when order_type='in-store' then 1 end) as total_instore_orders,
	count(case when order_type='online' then 1 end) as total_delivery_orders
from orders;

	
--3.19 Generate a report showing:
		--total low stock products
		--total out-of-stock products
		--total sufficiently stocked products
--using conditional aggregation.

select 
	   count(case when stock_level<1 then 1 end) as total_out_of_stock_products,
	   count(case when stock_level between 1 and 50 then 1 end) as total_low_stock_products,
	   count(case when stock_level > 50 then 1 end) as total_sufficiently_stock_products
from products;


--3.20 Generate a report showing:
	--total revenue from Drinks
	--total revenue from Food
	--total revenue from Beans / Merchandise
	--using SUM(CASE WHEN CategoryName = ... THEN ... END).
select * from categories;
select * from products;
select * from order_items;

select 
	sum(case when t1.category_name='Drinks' then t3.quantity*t3.unit_price else 0 end) As drinks_revenue,
	sum(case when t1.category_name='Food' then t3.quantity*t3.unit_price else 0 end) As foods_revenue,
	sum(case when t1.category_name IN ('Beans','Merchandise') then t3.quantity*t3.unit_price else 0 end) As beans_merchandise_revenue
from categories t1
join products t2
on t1.category_id=t2.category_id
join order_items t3
on t2.product_id=t3.product_id;


-- 3.21 If delivery_type exists in JSON, generate a report showing:
	--apartment deliveries
		--office deliveries
		--home deliveries
		--using CASE inside aggregate functions.
select * from orders;

UPDATE orders
SET delivery_notes =
    jsonb_set(
        delivery_notes,
        '{delivery_type}',
        '"apartment"'
    )
WHERE order_id = 1;

UPDATE orders
SET delivery_notes =
    jsonb_set(
        delivery_notes,
        '{delivery_type}',
        '"office"'
    )
WHERE order_id = 3;

UPDATE orders
SET delivery_notes =
    jsonb_set(
        delivery_notes,
        '{delivery_type}',
        '"home"'
    )
WHERE order_id = 2;

select 
		sum(case 
			when delivery_notes ? 'delivery_type' AND delivery_notes ->> 'delivery_type'='apartment'
			then 1 else 0
			end) AS apartment_deliveries,
		sum(case 
			when delivery_notes ? 'delivery_type' AND delivery_notes ->> 'delivery_type'='office'
			then 1 else 0
			end) AS office_deliveries,
		sum(case 
			when delivery_notes ? 'delivery_type' AND delivery_notes ->> 'delivery_type'='home'
			then 1 else 0
			end) AS home_deliveries
from orders;
		

--3.22 For each customer, display:
	--total orders
	--delivery orders
	--in-store orders
--using conditional aggregates.
select * from orders;


SELECT
	t1.full_name,
	Count(t2.order_id) AS Total_Orders,
	SUM(CASE when order_type='in-store' then 1 else 0 end ) AS in_store_orders,
	SUM(CASE when order_type='online' then 1 else 0 end ) AS delivery_orders
from customers t1
left join orders t2
on t1.customer_id=t2.customer_id
group by t1.full_name,t1.customer_id
order by t1.full_name;



--------------------------------------------------------------------------------------------------------------------------------------
-- Subqueries

-- 1 Find product(s) with the highest price
select * from products where price= (select MAX(price) from products);

-- 2 Find customers who placed orders after a certain customer( give one customer name here)
select * from orders;
select * from customers;

select t1.full_name,t2.ordered_at  from customers t1
join orders t2
on t1.customer_id=t2.customer_id
where ordered_at >(
		select MIN(t2.ordered_at)
		from customers t1
		join orders t2
		on t1.customer_id=t2.customer_id
		where t1.full_name='Abhinav Jaiswal'
);

select MIN(t2.ordered_at) from customers t1
join orders t2
on t1.customer_id=t2.customer_id;


--Another way using CTE
WITH abhinav_order AS (
    SELECT MIN(o.ordered_at) AS order_date
    FROM customers c
    JOIN orders o
    ON c.customer_id = o.customer_id
    WHERE c.full_name = 'Abhinav Jaiswal'
)

SELECT c.full_name,
       o.ordered_at
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
CROSS JOIN abhinav_order
WHERE o.ordered_at > abhinav_order.order_date;

--

select t1.full_name,t2.ordered_at,MIN(t2.ordered_at) from customers t1
join orders t2
on t1.customer_id=t2.customer_id
where t1.full_name='Abhinav JAiswal'
group by t1.full_name,t2.ordered_at
having ordered_at >MIN(t2.ordered_at);

select MIN(t2.ordered_at) from customers t1
join orders t2
on t1.customer_id=t2.customer_id;

-- 3 Find products priced above average Products Price
select * from products where price > (select AVG(price) from products);

-- 4 Find categories with more products than average category count
select t1.category_name,count(t2.product_id) from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_name,t1.category_id;


select t1.category_name,
count(t2.product_id)
from categories t1
join products t2
on t1.category_id=t2.category_id
group by t1.category_id,t1.category_name
having count(t2.product_id)>
(select AVG(p_count) 
from (
	select count(*) as p_count from products group by category_id
) x);
--------------------------------------------------------------------------
-- NON-CORRELATED: runs once, independent
SELECT product_name FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- CORRELATED: re-runs per outer row, references o.customer_id
SELECT c.full_name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
);

--1 Find products priced above the average price of their own category
select * from categories
select * from products;

select * from products p1
where price> ( select AVG(price) from products p2
			   where p1.category_id=p2.category_id);
-- It's a correlated subquery.

--2.Find products with stock below the average stock of their category
select * from products p1
where stock_level<( select AVG(stock_level) from products p2
			   where p1.category_id=p2.category_id);

---------------------------------------------------------------------------
--5 Find orders placed on the latest order dates
select * from orders;
select Max(ordered_at) from orders

select * from orders where ordered_at =(select Max(ordered_at) from orders);

--6 Find Products belonging to (use a category name – e.g. Food, or Merchandise – take 2 categories)
select t1.* from products t1
join categories t2
on t1.category_id=t2.category_id
where t2.category_name IN('Food','Drinks')
order by t2.category_id;

select * from products p
where p.category_id IN 
(select c.category_id from categories c where category_name in ('Food','Drinks'))
order by p.category_id;


-- 7  Find customers who ordered from Merchandise Category
select * from order_items;
select * from categories;

select t1.full_name from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
where t3.product_id IN (select category_id from categories where category_name='Merchandise' );


select t1.full_name from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
where t3.product_id IN
(select product_id from products where category_id=
(select category_id from  categories where category_name='Merchandise'));


--8 Find Categories that do not have any products
select * from categories;
insert into categories (category_name,description) values
('new_d','try something new');

select * from categories where category_id NOT IN (select category_id from products);

-- 9 Find customers who ordered the most expensive product
select t1.* from customers t1
join orders t2
on t1.customer_id=t2.customer_id
join order_items t3
on t2.order_id=t3.order_id
where t3.product_id=(Select product_id from products where price=(select MAX(price) from products));

-- 10 Customers who placed at least one order
select t1.*,count(t2.customer_id) from customers t1
join orders t2
on t1.customer_id=t2.customer_id
group by t1.full_name,t1.customer_id
having count(t2.customer_id)>1

select * from customers 
where customer_id IN (select customer_id from orders);


-- 11 Products never ordered
 select * from products;
 insert into products(product_name,price,stock_level,category_id)
 values ('cold coffee',60,10,1);

 select * from products where product_id NOT IN (select product_id from order_items);

 -- 12 Find Customers who ordered atleast one product costing more than 300
 select * from orders;
 select t1.* from customers t1
 join orders t2
 on t1.customer_id=t2.customer_id
 where t2.order_id IN (select order_id from order_items where unit_price>10 );


 -- 13 Find products that appear in atleast one order item with quantity more than 2
 select * from products t1
 where product_id IN (select product_id from order_items where quantity>2)

 -- 14 Find customers who placed more orders than the average customer order count

select t1.* ,count(t1.customer_id) from customers t1
join orders t2 on t1.customer_id=t2.customer_id
group by t1.customer_id
having count(t1.customer_id) >
							(select AVG(counts) from (
							 select count(customer_id) As counts
							 from orders
							 group by customer_id
							 ) x);
							 
-- 15  Find products whose stock is greater than average Stock

select * from products;
select * from products where stock_level >
							(select AVG(stock_level) from products);

-- 16 Find categories whose average product price is greater than overall average product price
select * from categories where category_id IN(
	select category_id from products
	group by category_id
	having AVG(price)>
			(select AVG(price) from products));

-- 17 Find products priced above the average price of their own category

select * from products p1
where price >
			(select AVG(price) as prices from products p2
			 where p1.category_id=p2.category_id);

-- 18 Find customers who placed more orders than the average orders per customer
select * from orders;

 select t1.* ,count(t1.customer_id) from customers t1
 join orders t2
 on t1.customer_id=t2.customer_id
 group by t1.customer_id
 having count(t1.customer_id)>(
								  select AVG(counts) from
					 (select count(customer_id) as counts  
					  from orders 
					  group by customer_id) x
 					  );
-- 19 Find products whose stock is less than the average stock of their own category
select * from products p1
where stock_level < 
		(select AVG(stock_level) from products p2 
		where p1.category_id=p2.category_id );
 
-- 20 Find categories where at least one product is priced above 300
select * from categories 
where category_id IN (select category_id from products where price>3);
--The IN operator treats this like a set of values. 
--Duplicate values inside the IN list do not cause duplicate rows in the output.

-----------------------------------------------------------------------------------------------
--Functions RollUp, Cube and Grouping Sets

-- 1 Count products by category using ROLLUP
select * from products

select COALESCE(t2.category_name,'Total') AS Categories,count(t1.category_id) from products t1
join categories t2
on t1.category_id=t2.category_id
group by ROLLUP(t2.category_name);

-- 2 Average price by category using ROLLUP
select category_id,AVG(price) from products
group by ROLLUP(category_id);

-- 3 Quantity sold by category and product using ROLLUP
select * from products

select t2.category_id,t1.product_id,sum(t1.quantity) from order_items t1
join products t2
on t1.product_id=t2.product_id
group by rollup( t2.category_id,t1.product_id);

--4 Revenue by category and product using ROLLUP
select * from order_items;

select t1.category_name,t2.product_name,sum(t3.quantity *t3.unit_price) AS Revenue
from categories t1
join products t2 on t1.category_id=t2.category_id
join order_items t3 on t2.product_id=t3.product_id
group by rollup(t1.category_name,t2.product_name);

-- cube
-- 1 Count products by category and price using CUBE
select * from products;

select category_id,price,count(product_id)
from products
group by cube(category_id,price);

-- 2 Quantity sold by category and product using CUBE
select * from order_items;

select t1.category_name,t2.product_name,sum(t3.quantity) AS Quantity_sold
from categories t1
join products t2 on t1.category_id=t2.category_id
join order_items t3 on t2.product_id=t3.product_id
group by cube(t1.category_name,t2.product_name);


---grouping set
 -- 1 Show product count by category, by price, and grand total using GROUPING SETS
select category_id,price,count(product_id)
from products
group by grouping sets(
(category_id),
(price),
()
);

-- 2 Show count by category and by product using GROUPING SETS

select t1.category_name,t2.product_name,count(t3.product_id) AS product_count
from categories t1
join products t2 on t1.category_id=t2.category_id
join order_items t3 on t2.product_id=t3.product_id
group by grouping sets(
  (t1.category_name),
  (t2.product_name)
);
-- 3  Revenue by category and by product using GROUPING SETS
select * from order_items;

select t1.category_name,t2.product_name,sum(t3.quantity*t3.unit_price) AS Revenue
from categories t1
join products t2 on t1.category_id=t2.category_id
join order_items t3 on t2.product_id=t3.product_id
group by grouping sets(
  (t1.category_name),
  (t2.product_name)
);

-----------------------------------------------------------------------------------------------------------
--  THE DAILY GRIND — Views
select * from categories;
select * from products

-- Create a Product Catalog view.
create or replace view product_catalog AS
select t1.product_id,t1.product_name,t2.category_name from products t1
join categories t2 on t1.category_id=t2.category_id;
select * from product_catalog;

-- Create Customer Directory view.
CREATE OR REPLACE VIEW customer_directory AS
SELECT
    cu.customer_id,
    cu.full_name,
    cu.email,
    cu.phone,
    a.street_line1,
    a.street_line2,
    a.label AS address_label,
    ci.city_name
FROM customers cu
LEFT JOIN addresses a ON a.address_id = cu.default_address_id
LEFT JOIN cities ci    ON ci.city_id   = a.city_id;

select * from customer_directory;


