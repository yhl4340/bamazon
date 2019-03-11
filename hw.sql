create database bamazon_db;
use bamazon_db;

create table products(
	item_id int auto_increment not null,
    product_name varchar(50) not null,
    dept_name varchar(50),
    price decimal(5,4),
    stock_quantity int,
    primary key(item_id)
);

insert into products( product_name, dept_name, price, stock_quantity)
values
('Diapers', 'Baby', 32.99, 150),
('Diaper Wipes', 'Baby', 14.5, 180),
('Formula', 'Food', 21, 80),
('Facial Masks', 'Beauty', 34.59, 36),
('Coffee Beans', 'Beverages', 14.99, 25),
('Vaseline', 'Beauty', 11.59, 90),
('Wine', 'Alcohol', 60.79, 6),
('Blue Apron', 'Food Delivery', 19.99,null),
('Moon Cheese', 'Snack', 11.99, 250),
('Kale', 'Produce', 3.99, 200);

select * from products;

/*to change the col value */
alter table products modify price decimal(5,2);
update products set stock_quantity =35 where item_id=8; 
