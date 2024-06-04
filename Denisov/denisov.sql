create database shop_denisov;

create table wishlists(
    id_wishlist serial primary key,
    quantity int
);

create table personnel(
    id_personnel serial primary key,
    Full_name varchar(45),
    Job_title varchar(45)
);

create table manufacturers(
    id_manufacturer serial primary key,
    name varchar(45),
    rating int
);

create table categories(
    id_categories serial primary key,
    name varchar(45)
);

create table models(
    id_models serial primary key,
    name varchar(45),
    price int,
    description varchar(45),
    quantity int,
    scale varchar(45),
    id_manufacturers int references manufacturers,
    id_categories int references categories
);

create table models_to_wishlists(
    id_models int references models,
    id_wishlist int references wishlists
);

create table orders(
    id_orders serial primary key,
    date date,
    id_models int references models,
    id_personnel int references personnel
);

create table buyers(
    id_buyers serial primary key,
    email varchar(45),
    password varchar(45),
    id_wishlists int references wishlists,
    id_orders int references orders
);

create table couriers(
    id_couriers serial primary key,
    shipment_method varchar(45),
    id_buyers int references buyers
);

create table deliveries(
    id_deliveries serial primary key,
    address varchar(45),
    track_number varchar(45),
    id_orders int references orders,
    id_couriers int references couriers
);

create table reviews(
    id_reviews serial primary key,
    start int,
    id_models int references models,
    id_buyers int references buyers
);

insert into wishlists(quantity) values (10), (7), (8), (38), (65), (34), (12), (3), (15), (26);

insert into personnel (Full_name, Job_title)
values ('John Doe', 'Software Developer'),
       ('Jane Smith', 'Marketing Manager'),
       ('Michael Johnson', 'Accountant'),
       ('Emily Davis', 'Graphic Designer'),
       ('David Brown', 'Project Manager'),
       ('Sarah Wilson', 'HR Coordinator'),
       ('Steven Martinez', 'Sales Representative'),
       ('Laura Thompson', 'Customer Service Specialist'),
       ('Kevin Lee', 'Product Manager'),
       ('Amanda White', 'Financial Analyst');

insert into wishlists (quantity)
values (10), (7), (8), (38), (65), (34), (12), (3), (15), (26);

insert into manufacturers (name, rating)
values ('Bandai Hobby',5),
       ('Kotobukiya', 4),
       ('Revell', 4),
       ('Tamiya', 5),
       ('Hasegawa', 4),
       ('Italeri', 4),
       ('Academy', 4),
       ('Trumpeter', 4),
       ('Dragon Models', 4),
       ('Airfix', 4);

insert into categories (name)
values ('HG'),
       ('MG'),
       ('RG'),
       ('Frame Arms'),
       ('Entry Grade'),
       ('Frame Arms Girls'),
       ('Armored Core'),
       ('PG'),
       ('Full Mechanics'),
       ('MGEX');

insert into models (name, price, description, quantity, scale, id_manufacturers, id_categories)
values ('Gundam Aerial', 1430, 'Gundam Aerial is...', 100, '1/144', 1, 1),
       ('Darilbalde', 2090, 'Darilbalde is...', 98, '1/144', 1, 1),
       ('Demi Trainer', 1320, 'Demi Trainer is...', 90, '1/144', 1, 1),
       ('Dilanza', 1760, 'Dilanza is...', 70, '1/144', 1, 1),
       ('Gundam Aerial Full Mechanics', 4180, 'Gundam Aerial Full Mechanics', 40, '1/100', 1, 9),
       ('Kagutsuchi-kou', 4180, 'Kagutsuchi-kou is...', 50, '1/100', 2, 4),
       ('Frame Arms Girls Gourai', 5280, 'Gourai is...', 70, NULL, 2, 6),
       ('Gundam Lfrith Ur', 2090, 'Gundam Lfrith Ur is...', 80, '1/144', 1, 1),
       ('Gundam Lfrith Thorn', 1760, 'Gundam Lfrith Thorn is...', 78, '1/144', 1, 1),
       ('Zowort', 1760, 'Zowort is...', 100, '1/144', 1, 1);

insert into models_to_wishlists (id_models, id_wishlist)
values (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5),
       (6, 6),
       (7, 7),
       (8, 8),
       (9, 9),
       (10, 10);

insert into orders (date, id_models, id_personnel)
values ('2024-04-11', 1, 3),
       ('2024-04-04', 2, 9),
       ('2024-06-14', 3, 9),
       ('2024-05-15', 4, 3),
       ('2024-05-04', 5, 9),
       ('2024-04-22', 6, 3),
       ('2024-05-24', 7, 3),
       ('2024-05-30', 8, 3),
       ('2024-05-15', 9, 3),
       ('2024-06-16', 10, 9);

insert into buyers (email, password, id_wishlists, id_orders)
values ('john.doe@example.com', 'password123', 1, 1),
       ('mary.smith@example.com', 'abc123', 2, 2),
       ('bob.johnson@example.com', 'passw0rd', 3, 3),
       ('susan.williams@example.com', 'qwerty', 4, 4),
       ('mike.brown@example.com', 'letmein', 5, 5),
       ('linda.davis@example.com', 'password', 6, 6),
       ('kevin.jackson@example.com', '123abc', 7, 7),
       ('jenny.miller@example.com', 'welcome1', 8, 8),
       ('chris.wilson@example.com', 'p@ssw0rd', 9, 9),
       ('amanda.thompson@example.com', 'secure123', 10, 10);

insert into couriers (shipment_method, id_buyers)
values ('Express', 1),
       ('Standard', 2),
       ('Express', 3),
       ('Standard', 4),
       ('Express', 5),
       ('Standard', 6),
       ('Express', 7),
       ('Standard', 8),
       ('Express', 9),
       ('Standard', 10);

insert into deliveries (address, track_number, id_orders, id_couriers)
values ('123 Main St', 'ABC123', 1, 1),
       ('456 Elm St', 'DEF456', 2, 2),
       ('789 Oak St', 'GHI789', 3, 3),
       ('101 Pine St', 'JKL101', 4, 4),
       ('202 Maple St', 'MNO202', 5, 5),
       ('303 Cedar St', 'PQR303', 6, 6),
       ('404 Birch St', 'STU404', 7, 7),
       ('505 Walnut St', 'VWX505', 8, 8),
       ('606 Cherry St', 'YZA606', 9, 9),
       ('707 Sycamore St', 'BCD707', 10, 10);

insert into reviews (start, id_models, id_buyers)
values (5, 1, 1),
       (4, 2, 2),
       (3, 3, 3),
       (4, 4, 4),
       (5, 5, 5),
       (3, 6, 6),
       (4, 7, 7),
       (5, 8, 8),
       (4, 9, 9),
       (5, 10, 10);



