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