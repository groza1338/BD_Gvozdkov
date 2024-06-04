create table customer
(
    id           serial
        primary key,
    first_name   varchar(50)  not null,
    second_name  varchar(50)  not null,
    email        varchar(100) not null
        unique,
    phone_number varchar(20)  not null
        unique,
    password     varchar(100) not null
);

create table customer_cards
(
    id              serial
        primary key,
    card_number     varchar(16)          not null
        unique,
    cardholder_name varchar(100)         not null,
    expiration_date date                 not null,
    cvv             varchar(4)           not null,
    card_type       varchar(20)          not null,
    is_active       boolean default true not null
);

create table customer_card_relationship
(
    customer_id integer not null
        references customer,
    card_id     integer not null
        references customer_cards,
    primary key (customer_id, card_id)
);

create table categories
(
    id                 serial
        primary key,
    name               varchar(100) not null,
    parent_category_id integer
        references categories
);

create table product_attributes
(
    id              serial
        primary key,
    attribute_name  varchar(100) not null,
    attribute_value varchar(255) not null
);

create table products
(
    id                serial
        primary key,
    name              varchar(255) not null,
    description       text         not null,
    price             integer      not null,
    manufacturer      varchar(100) not null,
    country_of_origin varchar(100) not null,
    category_id       integer      not null
        references categories
);

create table product_attribute_relationship
(
    product_id   integer not null
        references products,
    attribute_id integer not null
        references product_attributes,
    primary key (product_id, attribute_id)
);

create table reviews
(
    id          serial
        primary key,
    product_id  integer                             not null
        references products,
    customer_id integer                             not null
        references customer,
    rating      integer                             not null
        constraint reviews_rating_check
            check ((rating >= 1) AND (rating <= 5)),
    comment     text,
    date_posted timestamp default CURRENT_TIMESTAMP not null
);

create table cart
(
    id          serial
        primary key,
    customer_id integer
        references customer,
    product_id  integer
        references products,
    quantity    integer default 1 not null,
    unique (customer_id, product_id)
);

create table wishlist
(
    id          serial
        primary key,
    customer_id integer
        references customer,
    product_id  integer
        references products,
    unique (customer_id, product_id)
);

create table orders
(
    id          serial
        primary key,
    customer_id integer                             not null
        references customer,
    order_date  timestamp default CURRENT_TIMESTAMP not null
);

create table order_items
(
    id           serial
        primary key,
    order_id     integer not null
        references orders,
    product_id   integer not null
        references products,
    quantity     integer not null,
    total_amount integer
);

create table delivery
(
    id               serial
        primary key,
    order_id         integer               not null
        references orders,
    country          varchar(100)          not null,
    city             varchar(100)          not null,
    postal_code      varchar(20)           not null
        constraint chk_delivery_postal_code
            check ((postal_code)::text ~ '^[0-9]{5,6}$'::text),
    street_name      varchar(255)          not null,
    building_number  varchar(20)           not null,
    apartment_number varchar(20)           not null,
    delivery_date    timestamp             not null,
    is_delivered     boolean default false not null
);

create function recalculate_total_amount_and_update_price() returns trigger
language plpgsql
as
$$
BEGIN
    -- Проверка, вызывается ли триггер для таблицы order_items
    IF TG_TABLE_NAME = 'order_items' THEN
        NEW.total_amount := NEW.quantity * (SELECT price FROM products WHERE id = NEW.product_id);
        RETURN NEW;
    -- Проверка, вызывается ли триггер для таблицы products
    ELSIF TG_TABLE_NAME = 'products' THEN
        -- Обновление total_amount в order_items
        UPDATE order_items
        SET total_amount = NEW.price * quantity
        WHERE product_id = NEW.id;
        RETURN NEW;
    END IF;
END;
$$;

create trigger trg_update_order_items_price
    after update
        of price
    on products
    for each row
execute procedure recalculate_total_amount_and_update_price();

create trigger trg_recalculate_total_amount
    before insert or update
    on order_items
    for each row
execute procedure recalculate_total_amount_and_update_price();

-- Создание функции для проверки даты истечения срока действия карты
CREATE OR REPLACE FUNCTION check_card_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем, истекла ли дата карты
    IF NEW.expiration_date < CURRENT_DATE THEN
        NEW.is_active := FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера, вызывающего функцию при вставке или обновлении записи в таблице customer_cards
CREATE TRIGGER trg_check_card_expiration
BEFORE INSERT OR UPDATE ON public.customer_cards
FOR EACH ROW
EXECUTE FUNCTION check_card_expiration();