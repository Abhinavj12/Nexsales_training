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

--B19. Generate a detailed sales report showing:Order ID ,Customer Name ,Book Title ,Quantity 
--PriceAtPurchase 

--B20. Generate a complete order report showing:Order ID ,Customer Name ,City Name ,Book Title ,
--Quantity Ordered 
--Order Date 







