CREATE TABLE Cities (
    CityId          SERIAL PRIMARY KEY,
    CityName        VARCHAR(100) NOT NULL,
    ShippingCharge  NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (ShippingCharge >= 0)
);
 
CREATE TABLE Customers (
    CustomerId          SERIAL PRIMARY KEY,
    CustomerName        VARCHAR(150) NOT NULL,
    Email               VARCHAR(150) NOT NULL UNIQUE,
    Phone               VARCHAR(20)  NOT NULL UNIQUE,
    RegistrationDate    DATE NOT NULL DEFAULT CURRENT_DATE
);
 
CREATE TABLE Addresses (
    AddressId       SERIAL PRIMARY KEY,
    CustomerId      INT NOT NULL REFERENCES Customers(CustomerId) ON DELETE CASCADE,
    AddressLine     VARCHAR(255) NOT NULL,
    Pincode         VARCHAR(10)  NOT NULL,
    CityId          INT NOT NULL REFERENCES Cities(CityId)
);
 
CREATE TABLE Categories (
    CategoryId      SERIAL PRIMARY KEY,
    CategoryName    VARCHAR(100) NOT NULL UNIQUE
);
 
CREATE TABLE Books (
    BookId          SERIAL PRIMARY KEY,
    BookTitle       VARCHAR(255) NOT NULL,
    AuthorName      VARCHAR(150),
    CategoryId      INT NOT NULL REFERENCES Categories(CategoryId),
    Price           NUMERIC(8,2) NOT NULL CHECK (Price >= 0),
    Stock           INT NOT NULL DEFAULT 0 CHECK (Stock >= 0)
);
 
CREATE TABLE Orders (
    OrderId         SERIAL PRIMARY KEY,
    CustomerId      INT NOT NULL REFERENCES Customers(CustomerId),
    AddressId       INT NOT NULL REFERENCES Addresses(AddressId),
    OrderDate       DATE NOT NULL DEFAULT CURRENT_DATE,
    OrderStatus     VARCHAR(20) NOT NULL
                    CHECK (OrderStatus IN ('Pending','Shipped','Delivered','Cancelled')),
    PaymentMode     VARCHAR(20) NOT NULL
                    CHECK (PaymentMode IN ('UPI','Card','Cash on Delivery','Net Banking'))
);
 
CREATE TABLE Order_Items (
    OrderItemId     SERIAL PRIMARY KEY,
    OrderId         INT NOT NULL REFERENCES Orders(OrderId) ON DELETE CASCADE,
    BookId          INT NOT NULL REFERENCES Books(BookId),
    Quantity        INT NOT NULL CHECK (Quantity > 0),
    PriceAtPurchase NUMERIC(8,2) NOT NULL CHECK (PriceAtPurchase >= 0)
);

-- ---------- Cities ----------
INSERT INTO Cities (CityName, ShippingCharge) VALUES
('Mumbai',     50),
('Delhi',      60),
('Bangalore',  40),
('Pune',       30),
('Chennai',    70);
 
-- ---------- Customers ----------
INSERT INTO Customers (CustomerName, Email, Phone, RegistrationDate) VALUES
('Aarav Sharma',  'aarav.sharma@email.com',  '9876500001', '2025-03-15'),
('Priya Singh',   'priya.singh@email.com',   '9876500002', '2025-04-10'),
('Rohan Mehta',   'rohan.mehta@email.com',   '9876500003', '2025-05-20'),
('Ananya Iyer',   'ananya.iyer@email.com',   '9876500004', '2025-06-05'),
('Vikram Nair',   'vikram.nair@email.com',   '9876500005', '2025-06-15'),
('Sneha Reddy',   'sneha.reddy@email.com',   '9876500006', '2025-07-01'),
('Karan Kapoor',  'karan.kapoor@email.com',  '9876500007', '2025-07-10'),
('Divya Pillai',  'divya.pillai@email.com',  '9876500008', '2025-08-02'),
('Arjun Rao',     'arjun.rao@email.com',     '9876500009', '2025-08-20'),
('Meera Joshi',   'meera.joshi@email.com',   '9876500010', '2025-09-05');
 
-- ---------- Addresses ----------
INSERT INTO Addresses (CustomerId, AddressLine, Pincode, CityId) VALUES
(1,  '12 MG Road',              '400001', 1),
(2,  '45 Connaught Place',      '110001', 2),
(3,  '78 Brigade Road',         '560001', 3),
(4,  '23 FC Road',              '411001', 4),
(5,  '9 Anna Salai',            '600001', 5),
(6,  '56 Marine Drive',         '400002', 1),
(7,  '11 Karol Bagh',           '110005', 2),
(8,  '33 Indiranagar',          '560038', 3),
(9,  '67 Koregaon Park',        '411006', 4),
(10, '5 T Nagar',               '600017', 5),
(1, 'Second Home, Bandra',     '400050', 1);   -- Aarav Sharma's 2nd address
 
-- ---------- Categories ----------
INSERT INTO Categories (CategoryName) VALUES
('Fiction'),
('Non-Fiction'),
('Academic'),
('Children'),
('Stationery');
 
-- ---------- Books ----------
INSERT INTO Books (BookTitle, AuthorName, CategoryId, Price, Stock) VALUES
('The Silent Echo',          'A. Verma',     1, 250, 45),   -- Budget,  High Stock
('Mystery of Blue Lake',     'B. Chatterjee',1, 480,  8),   -- Standard, Low Stock
('Whispering Pines',         'C. D''Souza',  1, 850,  0),   -- Premium, Out of Stock
('The Last Voyage',          'D. Khanna',    1, 320, 22),   -- Standard, Medium Stock
('Modern History Unveiled',  'E. Bose',      2, 600, 15),   -- Standard, Medium Stock
('The Art of Living',        'F. Menon',     2, 280, 60),   -- Budget,  High Stock
('Economics Today',          'G. Sinha',     2, 750,  5),   -- Premium, Low Stock
('Mind and Matter',          'H. Banerjee',  2, 410,  0),   -- Standard, Out of Stock
('Data Structures in C',     'I. Gupta',     3, 650, 35),   -- Standard, High Stock
('Organic Chemistry Basics', 'J. Kulkarni',  3, 900, 12),   -- Premium, Medium Stock
('Calculus Made Easy',       'K. Pillai',    3, 350, 18),   -- Standard, Medium Stock
('Physics for Engineers',    'L. Acharya',   3, 720,  3),   -- Premium, Low Stock
('The Magic Treehouse',      'M. Fernandes', 4, 199, 50),   -- Budget,  High Stock
('Adventures of Tiny Tim',   'N. Joshi',     4, 220,  9),   -- Budget,  Low Stock
('Fairy Tales Collection',   'O. Krishnan',  4, 310,  0),   -- Standard, Out of Stock
('Coloring Fun Book',        'P. Rane',      4, 150, 70),   -- Budget,  High Stock
('Premium Notebook Set',     NULL,           5, 350,100),   -- Standard, High Stock
('Gel Pen Pack',             NULL,           5, 120,  5),   -- Budget,  Low Stock
('Sketchbook Deluxe',        NULL,           5, 480,  0),   -- Standard, Out of Stock
('Sticky Notes Combo',       NULL,           5,  90, 25);   -- Budget,  Medium Stock
 
-- ---------- Orders ----------
-- Customer order counts -> Aarav(1): 5 orders (Loyal), Priya(2): 3 (Regular), Rohan(3): 1 (New),
-- Ananya(4): 2 (Regular), Vikram(5): 1 (New), Sneha(6): 3 (Regular), Karan(7): 1 (New),
-- Divya(8): 2 (Regular), Arjun(9): 1 (New), Meera(10): 1 (New)
INSERT INTO Orders (CustomerId, AddressId, OrderDate, OrderStatus, PaymentMode) VALUES
(1,  1,  '2025-06-10', 'Delivered', 'UPI'),             -- 1
(1,  1,  '2025-07-05', 'Delivered', 'Card'),            -- 2
(1,  11, '2025-07-20', 'Shipped',   'UPI'),             -- 3
(1,  1,  '2025-08-15', 'Pending',   'Cash on Delivery'),-- 4
(1,  1,  '2025-09-01', 'Cancelled', 'Net Banking'),     -- 5
(2,  2,  '2025-06-25', 'Delivered', 'Card'),            -- 6
(2,  2,  '2025-07-12', 'Delivered', 'UPI'),             -- 7
(2,  2,  '2025-08-05', 'Shipped',   'Cash on Delivery'),-- 8
(3,  3,  '2025-07-18', 'Delivered', 'UPI'),             -- 9
(4,  4,  '2025-06-30', 'Delivered', 'Net Banking'),     -- 10
(4,  4,  '2025-08-22', 'Pending',   'Card'),            -- 11
(5,  5,  '2025-07-25', 'Delivered', 'Cash on Delivery'),-- 12
(6,  6,  '2025-07-08', 'Delivered', 'UPI'),             -- 13
(6,  6,  '2025-08-10', 'Shipped',   'Card'),            -- 14
(6,  6,  '2025-09-15', 'Delivered', 'UPI'),             -- 15
(7,  7,  '2025-07-22', 'Cancelled', 'Cash on Delivery'),-- 16
(8,  8,  '2025-08-01', 'Delivered', 'Net Banking'),     -- 17
(8,  8,  '2025-09-10', 'Pending',   'UPI'),             -- 18
(9,  9,  '2025-08-18', 'Delivered', 'Card'),            -- 19
(10, 10, '2025-09-20', 'Delivered', 'UPI');             -- 20
 
-- ---------- Order_Items ----------
INSERT INTO Order_Items (OrderId, BookId, Quantity, PriceAtPurchase) VALUES
(1,  1,  2, 250),   (1,  13, 1, 199),
(2,  5,  1, 600),
(3,  9,  1, 650),   (3,  17, 2, 350),
(4,  6,  3, 280),
(5,  20, 1, 90),
(6,  2,  1, 480),   (6,  4,  1, 320),
(7,  7,  1, 750),
(8,  14, 2, 220),
(9,  10, 1, 900),
(10, 11, 2, 350),
(11, 16, 3, 150),
(12, 12, 1, 720),
(13, 1,  1, 250),   (13, 18, 2, 120),
(14, 3,  1, 850),
(15, 19, 1, 480),
(16, 8,  1, 410),
(17, 13, 2, 199),
(18, 17, 1, 350),
(19, 9,  1, 650),
(20, 6,  2, 280);

select * from cities;
select * from customers;
select * from categories;
select * from books;
select * from addresses
	where customerId=1;
select * from orders
select * from order_items;

-----------------------------------------------------------------------------------
-- SECTION A – BASIC SELECT / FILTERING

--A1. Display all books with their price and stock.
select booktitle,price,stock from books;

--A2. Display all customers with their email and phone number.
select customername,email,phone from customers

-- A3. Display all cities and their shipping charges.
select * from cities

--A4. Display all orders placed after 1st July 2025.
select * from orders
where orderDate>'01-07-2025';

-- A5. Display all books whose stock is less than 20.
select * from books
where stock<20;

-- A6. Display all books priced above ₹500.
select * from books
where price>500;

--A7. Display all customers registered after 1st June 2025.
 select * from  customers
 where registrationDate>'01-06-2025';

 -- A8. Display all books belonging to category id 3.
select * from books
where categoryId=3;

--A9. Display all orders whose payment mode is UPI.
select * from orders
where paymentMode='UPI';

--A10. Display all books sorted by price from highest to lowest.
select * from books
order by price DESC;

-----------------------------------------------------------------------------------------
-- SECTION B – JOINS
--B1. Display Book Title along with Category Name.
 select t1.categoryName,t2.bookTitle from categories t1
 join books t2
 on t1.categoryId=t2.categoryId;

--B2. Display Customer Name along with City Name.
select t3.customerName,t1.cityName from cities t1
join addresses t2
on t1.cityId=t2.cityId
join customers t3
on t2.customerId=t3.customerId;

--B3. Display Customer Name and Order Date.
select * from orders;

select t1.customerName,t2.orderDate from customers t1
join orders t2
on t1.customerId=t2.customerId;

--B4. Display Order ID and Customer Name.
select t2.orderID,t1.customerName from customers t1
join orders t2
on t1.customerId=t2.customerId;

--B5. Display Book Title and Quantity Ordered.
select * from order_items;

select t3.bookTitle,t2.quantity from orders t1
join order_items t2
on t1.orderId=t2.orderId
join books t3
on t2.bookId=t3.bookId;

-- B6. Display Order ID, Book Title, Quantity Ordered.
select t1.orderId,t3.bookTitle,t2.quantity from orders t1
join order_items t2
on t1.orderId=t2.orderId
join books t3
on t2.bookId=t3.bookId;

--B7. Display Customer Name, Order ID, Order Date.
select t4.customerName,t1.orderId,t1.orderDate from orders t1
join order_items t2
on t1.orderId=t2.orderId
join books t3
on t2.bookId=t3.bookId
join customers t4
on t1.customerId=t4.customerId;

--B8. Display Customer Name and the books they ordered.
select t4.customerName,t3.bookTitle from orders t1
join order_items t2
on t1.orderId=t2.orderId
join books t3
on t2.bookId=t3.bookId
join customers t4
on t1.customerId=t4.customerId;

--B9. Display Category Name and Book Title.
 select t1.categoryName,t2.bookTitle from categories t1
 join books t2
 on t1.categoryId=t2.categoryId;
 
--B10. Display Customer Name, City Name, and Order Date.
select t3.customerName,t1.cityName,t4.orderDate from cities t1
join addresses t2
on t1.cityId=t2.cityId
join customers t3
on t2.customerId=t3.customerId
join orders t4
on t3.customerId=t4.customerId;

--B11. Display Order ID, Customer Name, Book Title, and Quantity.
select t2.orderId,t1.customerName,t4.bookTitle,t3.quantity from customers t1
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
join books t4 on t3.bookId=t4.bookId;

--B12. Display Book Title, Category Name, and Price.
select t1.bookTitle,t2.categoryName,t1.price
from books t1
join categories t2 on t1.categoryId=t2.categoryId;

--B13. Display Customer Name and total books ordered in each order.
select t1.customerName,sum(t3.quantity) as total_books_order 
from customers t1
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
group by customerName,t1.customerId,t3.orderID;


-- B14. Display all books along with their categories sorted by category name.
select t1.*,t2.categoryName from books t1
join categories t2 on t1.categoryId=t2.categoryId
order by t2.categoryName;

--B15. Display all customers and their addresses
select t1.*,t2.addressLine from customers t1
join addresses t2 on t1.customerId=t2.customerId;

--B16. Display all orders along with customer and address information.
select t1.*,t2.customerName,t3.addressLine from orders t1
join customers t2 on t1.customerId=t2.customerId
join addresses t3 on t2.customerId=t3.customerId

--B17. Display all books purchased by customers from a particular city.
select t1.*,t5.cityName from books t1
join order_items t2 on t1.bookId=t2.bookId
join orders t3 on t2.orderId=t3.orderId
join addresses t4 on t3.addressId=t4.addressId
join cities t5 on t4.cityId=t5.cityId
where t5.cityname='Mumbai';

select * from addresses;
select * from order_items;
select * from orders;
select *  from books;


--B18. Display Customer Name, Book Title, Quantity, and Order Date.
select t1.customerName,t4.bookTitle,t3.quantity,t2.orderDate from customers t1
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
join books t4 on t3.bookId=t4.bookId;


--B19. Generate a detailed sales report showing:Order ID ,Customer Name ,Book Title ,Quantity 
--PriceAtPurchase 
select * from order_items;

select t2.orderId,t1.customerName,t4.bookTitle,t3.quantity,t3.priceAtPurchase from customers t1
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
join books t4 on t3.bookId=t4.bookId;

--B20. Generate a complete order report showing:Order ID ,Customer Name ,City Name ,Book Title ,
--Quantity Ordered 
--Order Date 
select t2.orderId,t1.customerName,t6.cityName,t4.bookTitle,t3.quantity,t2.orderDate from customers t1
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
join books t4 on t3.bookId=t4.bookId
join addresses t5 on t1.customerId=t5.customerId
join cities t6 on t5.cityId=t6.cityId;
------------------------------------------------------------------------------------------
---SECTION C – AGGREGATE / GROUP BY / HAVING

--C1. Find the total number of books available.
select count(*) as total_no_books from books;

--C2. Find the total number of customers registered.
select count(*) from customers;

--C3. Find the total number of orders placed.
select count(*) from orders;

--C4. Find the total number of categories available.
select count(*) from categories;

--C5. Find the average price of all books.
select AVG(price) from books;

--C6. Find the highest book price.
select MAX(price) from books;

--C7. Find the lowest book price.
select MIN(price) from books;

--C8. Find the total stock available across all books.
select * from books;
select sum(stock) from books;

--C9. Find the average stock available per category.
select t1.categoryName,AVG(stock) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C10. Find the total quantity sold across all order items.
select sum(quantity) from order_items;

--C11. Find the highest quantity ordered in a single order item.
select MAX(quantity) from order_items;

--C12. Find the lowest quantity ordered in a single order item.
select MIN(quantity) from order_items;

--C13. Find the total revenue generated assuming revenue = PriceAtPurchase × Quantity.
select * from order_items;
select sum(PriceAtPurchase*quantity) AS revenue from order_items;

--C14. Find the average quantity ordered per order item.
select AVG(quantity) from order_items;

--C15. Find the total number of books with stock greater than 50.
select count(*) from books where stock>50;

--C16. Find the average book price for books costing more than ₹400.
select AVG(price) from books where price>400;

--C17. Find the total stock value of all books (Price × Stock).
select sum(price*stock) AS toatl_stocks_value from books;

--C18. Find the total number of customers who have placed orders.
select * from orders;
select count(customerID) from orders;

--C19. Find the difference between the highest and lowest book price.
SELECT MAX(price)-MIN(price) AS Differenec from books;

--C20. Find the total number of orders placed per payment mode.
select * from orders;
select paymentMode,count(orderId) from orders
group by paymentMode;

-----------------------------------------------------------------------
-- ---------------- GROUP BY / HAVING ---------------------------------

--C21. Find the number of books in each category.
select t1.categoryName,count(t2.bookId) from categories t1
join books t2
on t1.categoryId=t2.categoryId
group by t1.categoryId;

--C22. Find the number of customers in each city.
select * from cities;
select t3.cityName ,count(t1.customerID) from customers t1
join addresses t2 on t1.customerId=t2.customerId
join cities t3 on t2.cityId=t3.cityId
group by t3.cityName;

--C23. Find the number of orders placed by each customer.
select customerId,count(orderId) from orders
group by customerId
order by customerID;

--C24. Find the average book price for each category.
select t1.categoryName,avg(price) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C25. Find the total stock available in each category.
select t1.categoryName,sum(stock) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C26. Find the total quantity sold for each book.
select t2.bookId,sum(quantity) from order_items t1
join books t2 on t1.bookId=t2.bookId
group by t2.bookId
order by t2.bookId;

--C27. Find the total revenue generated by each book.
select t2.bookId,sum(t1.quantity*t1.priceAtPurchase) from order_items t1
join books t2 on t1.bookId=t2.bookId
group by t2.bookId
order by t2.bookId;

--C28. Find the total number of books available under each category.
select t1.categoryName,count(t2.bookId) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C29. Find the average stock available in each category.
select t1.categoryName,avg(stock) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C30. Find the total orders placed from each city.
select t3.cityName,count(t1.orderID) from orders t1
join addresses t2 on t1.addressId=t2.addressId
join cities t3 on  t2.cityId=t3.cityId
group by t3.cityName;

--C31. Find the highest-priced book in each category.
select t1.categoryName,max(t2.price) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C32. Find the lowest-priced book in each category.
select t1.categoryName,min(t2.price) from categories t1
join books t2 on t1.categoryId=t2.categoryId
group by t1.categoryName;

--C33. Find the total quantity ordered by each customer.
select * from order_items;
select * from orders;

select t1.customerId,sum(t2.quantity) from orders t1
join order_items t2
on t1.orderId=t2.orderId
group by t1.customerId
order by t1.customerId;

--C34. Find the total revenue generated by each customer.
select t1.customerId,sum(t2.quantity*t2.priceAtPurchase) AS Revenue from orders t1
join order_items t2
on t1.orderId=t2.orderId
group by t1.customerId
order by t1.customerId;

--C35. Find the average quantity ordered for each book.
select * from order_items;
select * from orders;

select bookId,round(AVG(quantity),2) from order_items
group by bookId
order by bookid;

--C36. Find the total stock value for each category.
select * from books;

select categoryId,sum(stock) from books 
group by categoryId
order by categoryId;

--C37. Find the total number of distinct books ordered by each customer.
select * from books;
select * from customers;

select t1.customerId,count(DISTINCT t3.bookTitle) from orders t1
join order_items t2 on t1.orderId=t2.orderId
join books t3 on t2.bookId=t3.bookId
group by t1.customerId;

--C38. Find the total quantity sold in each category.
select * from order_items;

select t3.categoryName,sum(t1.quantity) AS Total_quantity_sold from order_items t1
join books t2 on t1.bookId=t2.bookId
join categories t3 on t2.categoryID=t3.categoryId
group by t3.categoryName;

--C39. Find the number of customers who placed orders in each city.
select * from addresses;

select t1.cityName,count(t4.customerID) from cities t1
join addresses t2 on t1.cityId=t2.cityId
join customers t3 on t2.customerID=t3.customerId
join orders t4 on t3.customerId=t4.customerId
group by t1.cityName;

--C40. Find the total revenue generated for each category and display the results in descending order.
select t3.categoryName,sum(t1.quantity*t1.priceAtPurchase) as Revenue from order_items t1
join books t2 on t1.bookId=t2.bookId
join categories t3 on t2.categoryId=t3.categoryID
group by t3.categoryName;
---------------------------------------------------------------------------------------------------------------------------------------

--SECTION D – CASE WHEN QUESTIONS--

-- ---------- 1) Book Price Bucket ----------
-- Budget < 300 | Standard 300-700 | Premium > 700

-- D1. Display each book with its price bucket.
select * from books;

select bookId,bookTitle,price,
 		case
		 	when price<300 then 'Budget'
			when price between 300 and 700 then 'Standard'
			else 'preimium'
		end As Book_price_bucket
from books;

--D2. Count how many books belong to each price bucket.

select Book_price_bucket,count(*)
from 
(select bookId,
 		case
		 	when price<300 then 'Budget'
			when price between 300 and 700 then 'Standard'
			else 'preimium'
		end As Book_price_bucket
from books) t1
group by Book_price_bucket;

-- D3. Find total stock available in each price bucket.

select Book_price_bucket,sum(stock)
from 
(select stock,
 		case
		 	when price<300 then 'Budget'
			when price between 300 and 700 then 'Standard'
			else 'preimium'
		end As Book_price_bucket
from books) t1
group by Book_price_bucket;

-- D4. Find average book price in each price bucket.
select Book_price_bucket,round(Avg(price),2)
from 
(select price,
 		case
		 	when price<300 then 'Budget'
			when price between 300 and 700 then 'Standard'
			else 'preimium'
		end As Book_price_bucket
from books) t1
group by Book_price_bucket;

-- ---------- 2) Stock Status ----------
-- Out of Stock = 0 | Low Stock 1-10 | Medium Stock 11-30 | High Stock > 30
 
-- D5. Display each book with its stock status.
select * from books;

select bookId,bookTitle,price,stock,
 		case
		 	when stock<=0 then 'Out_of_stock'
			when stock between 1 and 10 then 'Low_stock'
			when stock between 11 and 20 then 'Medium_stock'
			else 'High_stock'
		end As stock_status
from books;

--D6. Count books in each stock status.
select stock_status,count(*)
from 
(select bookId,
 		case
		 	when stock<=0 then 'Out_of_stock'
			when stock between 1 and 10 then 'Low_stock'
			when stock between 11 and 20 then 'Medium_stock'
			else 'High_stock'
		end As stock_status
from books) t1
group by stock_status;

-- D7. Find total stock under each stock status.
select stock_status,sum(stock)
from 
(select stock,
 		case
		 	when stock<=0 then 'Out_of_stock'
			when stock between 1 and 10 then 'Low_stock'
			when stock between 11 and 20 then 'Medium_stock'
			else 'High_stock'
		end As stock_status
from books) t1
group by stock_status;

-- D8. Find average price of books under each stock status.
select stock_status,avg(price)
from 
(select price,
 		case
		 	when stock<=0 then 'Out_of_stock'
			when stock between 1 and 10 then 'Low_stock'
			when stock between 11 and 20 then 'Medium_stock'
			else 'High_stock'
		end As stock_status
from books) t1
group by stock_status;


-- ---------- 3) Customer Type based on order count ----------
-- New = 1 order | Regular = 2-3 orders | Loyal = more than 3 orders
 
-- D9. Display each customer with total orders and customer type.
select customerId,count(orderId) AS Total_orders,
		case
			when count(orderId)=1 then 'New'
			when count(orderId) between 2 and 3 then 'regular'
			else 'Loyal'
		end as customer_type
from orders
group by customerId
order by customerId;

--D10. Count customers in each customer type.
select * from orders;
select customer_type,count(*)
from
(select customerId, count(orderId),
		case
			when count(orderId)=1 then 'New'
			when count(orderId) between 2 and 3 then 'regular'
			else 'Loyal'
		end as customer_type
from orders
group by customerId) t1
group by customer_type;

--D11. Find total revenue generated by each customer type.
select * from orders;

WITH cust_type AS (
	select customerId,
		case
			when count(orderId)=1 then 'New'
			when count(orderId) between 2 and 3 then 'regular'
			else 'Loyal'
		end as customer_type
from orders
group by customerId 
)
select t1.customer_type,sum(t3.quantity*t3.priceAtpurchase) 
from cust_type t1 
join orders t2 on t1.customerId=t2.customerId
join order_items t3 on t2.orderId=t3.orderId
group by customer_type;

--D12. Find average order count by customer type.
with cust_type AS (
	select customerId,count(*) AS order_count,
			case
			when count(orderId)=1 then 'New'
			when count(orderId) between 2 and 3 then 'regular'
			else 'Loyal'
		end as customer_type
from orders
group by customerId 
)
select customer_type,round(AVG(order_count),2) from cust_type
group by customer_type;

-- ---------- 4) Order Status Reporting ----------
 
-- D13. Display all orders with a readable order status label using CASE.
select * from orders;
select orderID,
		 CASE
           WHEN OrderStatus = 'Pending'   THEN 'Order is Pending'
           WHEN OrderStatus = 'Shipped'   THEN 'On the Way'
           WHEN OrderStatus = 'Delivered' THEN 'Successfully Delivered'
           WHEN OrderStatus = 'Cancelled' THEN 'Order Cancelled'
       END AS ReadableStatus
FROM Orders;

-- D14. Count orders under each status.
with ReadableStatus_type As(
	select orderID,
		 CASE
           WHEN OrderStatus = 'Pending'   THEN 'Order is Pending'
           WHEN OrderStatus = 'Shipped'   THEN 'On the Way'
           WHEN OrderStatus = 'Delivered' THEN 'Successfully Delivered'
           WHEN OrderStatus = 'Cancelled' THEN 'Order Cancelled'
       END AS ReadableStatus
FROM Orders
)
select ReadableStatus,count(*) from ReadableStatus_type 
group by ReadableStatus;

-- D15. Find total revenue from delivered orders only.

with ReadableStatus_type As(
	select orderID,OrderStatus,
		 CASE
           WHEN OrderStatus = 'Pending'   THEN 'Order is Pending'
           WHEN OrderStatus = 'Shipped'   THEN 'On the Way'
           WHEN OrderStatus = 'Delivered' THEN 'Successfully Delivered'
           WHEN OrderStatus = 'Cancelled' THEN 'Order Cancelled'
       END AS ReadableStatus
FROM Orders
)
select t1.ReadableStatus,sum(t2.quantity*t2.priceAtpurchase) from ReadableStatus_type t1
join order_items t2 on t1.orderId=t2.orderId
where OrderStatus= 'Delivered'
group by ReadableStatus;

--D16. Count how many orders were cancelled.
select * from orders;
select orderStatus,count(*)
from orders
where orderStatus='Cancelled'
group by orderStatus;


-- ---------- 5) Payment Mode Reporting ----------
select *  from orders;
select * from order_items;
--D17. Display orders with payment mode category.
select orderId,
			CASE
				WHEN paymentMode='Cash on Delivery' THEN 'COD'
				ELSE paymentMode
			END AS Payment_Mode_Reporting
from orders;

--D18. Find total orders by payment mode.

WITH Payment_Mode_Tab AS (
	select orderId,
			CASE
				WHEN paymentMode='Cash on Delivery' THEN 'COD'
				ELSE paymentMode
			END AS Payment_Mode_Reporting
	from orders
)
select Payment_Mode_Reporting,count(*)
from Payment_Mode_Tab
group by Payment_Mode_Reporting;

--D19. Find total revenue by payment mode.
	select * from order_items

	WITH Payment_Mode_Tab AS (
	select orderId,
			CASE
				WHEN paymentMode='Cash on Delivery' THEN 'COD'
				ELSE paymentMode
			END AS Payment_Mode_Reporting
	from orders
)
select t1.Payment_Mode_Reporting,sum(t2.quantity*t2.priceAtPurchase) AS Revenue
from Payment_Mode_Tab t1
join order_items t2
on t1.orderId=t2.orderId
group by t1.Payment_Mode_Reporting;

---D20. Find average order value by payment mode.
WITH Payment_Mode_Tab AS (
	select orderId,
			CASE
				WHEN paymentMode='Cash on Delivery' THEN 'COD'
				ELSE paymentMode
			END AS Payment_Mode_Reporting
	from orders
)
select t1.Payment_Mode_Reporting,round(AVG(t2.quantity*t2.priceAtPurchase),2) AS Revenue
from Payment_Mode_Tab t1
join order_items t2
on t1.orderId=t2.orderId
group by t1.Payment_Mode_Reporting;
