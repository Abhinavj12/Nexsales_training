CREATE TABLE cities (
  city_id          INTEGER          PRIMARY KEY,
  city_name        VARCHAR(100) ,
  delivery_surcharge DECIMAL(6,2)
);
SELECT * FROM cities;

CREATE TABLE addresses(
address_id SERIAL PRIMARY KEY,
street_line1 VARCHAR(200) NOT NULL,
street_line2 VARCHAR(200),
label VARCHAR(50),
city_id INT NOT NULL
REFERENCES cities(city_id)
);
SELECT * FROM addresses;

CREATE TABLE customers(
	customer_id SERIAL PRIMARY KEY,
	full_name VARCHAR(200),
	email VARCHAR(200) NOT NULL UNIQUE,
	phone VARCHAR(20),
	default_address_id INT
	REFERENCES addresses(address_id)
);
SELECT * FROM customers;

CREATE TABLE categories (
  category_id   SERIAL         PRIMARY KEY,
  category_name VARCHAR(100)   NOT NULL UNIQUE,
  description   TEXT
);
SELECT * FROM categories;

CREATE TABLE products (
  product_id    SERIAL         PRIMARY KEY,
  product_name  VARCHAR(150)   NOT NULL,
  price         DECIMAL(8,2)   NOT NULL CHECK (price >= 0),
  stock_level   INT            NOT NULL DEFAULT 0
                  CHECK (stock_level >= 0),
  category_id   INT            NOT NULL
                  REFERENCES categories(category_id)
);
Select * from products;

CREATE TABLE ORDERS_2(	
    order_id SERIAL PRIMARY KEY,
	customer_id INT NOT NULL REFERENCES customers(customer_id),
	delivery_address_id INT REFERENCES addresses(address_id),
	ordered_at TIMESTAMP NOT NULL DEFAULT NOW(),
	total_amount DECIMAL(10,2) NOT NULL CHECK(total_amount>=0),
	order_type VARCHAR(20) NOT NULL DEFAULT 'in-store' CHECK(order_type IN('in-store','online')) 
);
--DROP TABLE ORDERS;
select * from orders;


CREATE TABLE order_items (
  item_id     SERIAL         PRIMARY KEY,
  order_id    INT            NOT NULL
                REFERENCES orders(order_id),
  product_id  INT            NOT NULL
                REFERENCES products(product_id),
  quantity    INT            NOT NULL CHECK (quantity > 0),
  unit_price  DECIMAL(8,2)   NOT NULL CHECK (unit_price >= 0)
);

select * from order_items;



--Insertion
INSERT INTO cities (city_id ,city_name, delivery_surcharge) VALUES
  (1,'Mumbai',  0.00),
  (2,'Pune', 2.50),
  (3,'Hyderabad', 1.75),
  (4,'Banglore',   3.00);

SELECT * FROM cities;

INSERT INTO addresses (street_line1, street_line2, label, city_id) VALUES
  ('12 JP ROAD',     NULL,        'Home', 1),
  ('88 AB NAGAR',      'Apt 4B',   'Work', 1),
  ('45 NS COLONY',      NULL,        'Home', 2),
  ('200 MN house',     'Suite 10', 'Work', 3);

SELECT * FROM addresses;

INSERT INTO customers (full_name, email, phone, default_address_id) VALUES
  ('Abhinav Jaiswal', 'abhinav@email.com', '9876543210', 1),  -- customer_id = 1
  ('Aryan Sharma',    'aryan@email.com',   '9123456780', 2),  -- customer_id = 2
  ('jason',    'jason@email.com',   '8001112222', 3),
  ('placido',       'placido@email.com',   NULL,          4);

SELECT * FROM customers;




