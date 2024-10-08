-- Вставка данных в таблицу UserAccount
INSERT INTO UserAccount (username, password, email, first_name, last_name, phone, address, role)
VALUES
('john_doe', 'hashed_password1', 'john.doe@example.com', 'John', 'Doe', '1234567890', '123 Main St, Anytown', 'customer'),
('jane_smith', 'hashed_password2', 'jane.smith@example.com', 'Jane', 'Smith', '0987654321', '456 Elm St, Othertown', 'customer'),
('admin_user', 'hashed_admin_password', 'admin@example.com', 'Admin', 'User', '5555555555', '789 Oak St, Cityville', 'admin');

-- Вставка данных в таблицу Category
INSERT INTO Category (category_name, description, parent_category_id)
VALUES
('Электроника', 'Все электронные устройства', NULL),
('Компьютеры и планшеты', 'ПК, ноутбуки и планшеты', 1),
('Смартфоны', 'Мобильные телефоны и аксессуары', 1),
('Ноутбуки', 'Различные модели ноутбуков', 2),
('Настольные ПК', 'Стационарные компьютеры', 2);

-- Вставка данных в таблицу Brand
INSERT INTO Brand (brand_name, rating, description)
VALUES
('Apple', 4.8, 'Производитель iPhone, MacBook и других устройств'),
('Samsung', 4.5, 'Известен своими смартфонами и телевизорами'),
('Dell', 4.2, 'Производитель компьютеров и аксессуаров'),
('Lenovo', 4.1, 'Компьютеры и электроника'),
('HP', 4.0, 'Компьютеры и принтеры');

-- Вставка данных в таблицу Product
INSERT INTO Product (name, description, price, quantity_in_stock, status, category_id, brand_id)
VALUES
('iPhone 14', 'Новейший смартфон от Apple', 999.99, 50, 'available', 3, 1),
('Galaxy S22', 'Новейший смартфон от Samsung', 899.99, 40, 'available', 3, 2),
('MacBook Pro 16"', 'Ноутбук Apple с чипом M1', 2499.99, 20, 'available', 4, 1),
('Dell XPS 13', 'Ультратонкий ноутбук от Dell', 1299.99, 30, 'available', 4, 3),
('Lenovo ThinkPad X1 Carbon', 'Бизнес-ноутбук от Lenovo', 1499.99, 25, 'available', 4, 4),
('HP Envy Desktop', 'Настольный ПК от HP', 799.99, 15, 'available', 5, 5),
('iPad Pro', 'Планшет от Apple', 999.99, 35, 'available', 2, 1),
('Galaxy Tab S8', 'Планшет от Samsung', 749.99, 30, 'available', 2, 2),
('Apple Watch Series 7', 'Новейшие умные часы от Apple', 399.99, 60, 'available', 1, 1),
('Samsung Galaxy Watch 4', 'Новейшие умные часы от Samsung', 349.99, 50, 'available', 1, 2);

-- Вставка данных в таблицу CustomerOrder
INSERT INTO CustomerOrder (user_id, status, total_amount)
VALUES
(1, 'pending', 3499.98), -- Заказ пользователя john_doe
(2, 'pending', 2199.98); -- Заказ пользователя jane_smith

-- Вставка данных в таблицу OrderItem
-- Для заказа 1
INSERT INTO OrderItem (order_id, product_id, quantity, price_per_unit)
VALUES
(1, 1, 1, 999.99),  -- iPhone 14
(1, 3, 1, 2499.99); -- MacBook Pro 16"

-- Для заказа 2
INSERT INTO OrderItem (order_id, product_id, quantity, price_per_unit)
VALUES
(2, 2, 1, 899.99),  -- Galaxy S22
(2, 4, 1, 1299.99); -- Dell XPS 13

-- Вставка данных в таблицу Payment
INSERT INTO Payment (order_id, amount, payment_method)
VALUES
(1, 3499.98, 'card'), -- Платеж для заказа 1
(2, 2199.98, 'cash'); -- Платеж для заказа 2

-- Вставка данных в таблицу Delivery
INSERT INTO Delivery (order_id, shipping_address, delivery_status, tracking_number, delivery_date)
VALUES
(1, '123 Main St, Anytown', 'processing', 'TRACK123456', CURRENT_DATE + INTERVAL '5 days'),
(2, '456 Elm St, Othertown', 'processing', 'TRACK789012', CURRENT_DATE + INTERVAL '3 days');

-- Вставка данных в таблицу Review
INSERT INTO Review (product_id, user_id, rating, comment)
VALUES
(1, 1, 5, 'Отличный телефон! Очень доволен покупкой.'), -- Отзыв john_doe на iPhone 14
(3, 1, 5, 'MacBook Pro невероятно быстрый и стильный.'), -- Отзыв john_doe на MacBook Pro
(2, 2, 4, 'Хороший телефон, но батарея могла быть лучше.'), -- Отзыв jane_smith на Galaxy S22
(4, 2, 5, 'Обожаю этот ноутбук! Очень рекомендую.'), -- Отзыв jane_smith на Dell XPS 13
(5, 1, 4, 'Хороший бизнес-ноутбук, полностью удовлетворяет мои потребности.'); -- Отзыв john_doe на ThinkPad

-- Вставка данных в таблицу Cart
INSERT INTO Cart (user_id)
VALUES
(1), -- Корзина для john_doe
(2); -- Корзина для jane_smith

-- Вставка данных в таблицу CartItem
-- Для корзины 1
INSERT INTO CartItem (cart_id, product_id, quantity)
VALUES
(1, 9, 1), -- Apple Watch Series 7
(1, 7, 1); -- iPad Pro

-- Для корзины 2
INSERT INTO CartItem (cart_id, product_id, quantity)
VALUES
(2, 8, 1); -- Galaxy Tab S8
