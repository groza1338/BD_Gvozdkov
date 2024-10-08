-- Создание ENUM типов
CREATE TYPE UserRoleEnum AS ENUM ('admin', 'customer', 'manager');
CREATE TYPE ProductStatusEnum AS ENUM ('available', 'out_of_stock');
CREATE TYPE OrderStatusEnum AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE PaymentMethodEnum AS ENUM ('card', 'cash');
CREATE TYPE DeliveryStatusEnum AS ENUM ('processing', 'in_transit', 'delivered', 'returned', 'cancelled');

-- 1. Покупатель (UserAccount)
CREATE TABLE UserAccount (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    role UserRoleEnum NOT NULL
);

-- 2. Категория (Category)
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INTEGER REFERENCES Category(category_id) ON DELETE SET NULL
);

-- 3. Бренд (Brand)
CREATE TABLE Brand (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
    description TEXT
);

-- 4. Товар (Product)
CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity_in_stock INTEGER NOT NULL CHECK (quantity_in_stock >= 0),
    status ProductStatusEnum NOT NULL,
    category_id INTEGER REFERENCES Category(category_id) ON DELETE SET NULL,
    brand_id INTEGER REFERENCES Brand(brand_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Заказ (CustomerOrder)
CREATE TABLE CustomerOrder (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES UserAccount(user_id) ON DELETE CASCADE,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status OrderStatusEnum NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0)
);

-- 6. Позиция заказа (OrderItem)
CREATE TABLE OrderItem (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES CustomerOrder(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Product(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit NUMERIC(10, 2) NOT NULL CHECK (price_per_unit >= 0)
);

-- 7. Отзыв (Review)
CREATE TABLE Review (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES Product(product_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES UserAccount(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Платёж (Payment)
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES CustomerOrder(order_id) ON DELETE CASCADE,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method PaymentMethodEnum NOT NULL
);

-- 9. Доставка (Delivery)
CREATE TABLE Delivery (
    delivery_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES CustomerOrder(order_id) ON DELETE CASCADE,
    shipping_address TEXT NOT NULL,
    tracking_number VARCHAR(50),
    delivery_status DeliveryStatusEnum NOT NULL,
    delivery_date DATE
);

-- 10. Корзина (Cart)
CREATE TABLE Cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES UserAccount(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Элемент корзины (CartItem)
CREATE TABLE CartItem (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES Cart(cart_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Product(product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);
