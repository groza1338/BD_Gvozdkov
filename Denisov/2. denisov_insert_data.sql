-- Вставка данных в таблицу wishlists
INSERT INTO wishlists (quantity) VALUES (5);
INSERT INTO wishlists (quantity) VALUES (10);

-- Вставка данных в таблицу personnel
INSERT INTO personnel (Full_name, Job_title) VALUES ('Иван Иванов', 'Продавец');
INSERT INTO personnel (Full_name, Job_title) VALUES ('Петр Петров', 'Менеджер');

-- Вставка данных в таблицу manufacturers
INSERT INTO manufacturers (name, rating) VALUES ('Компания А', 8);
INSERT INTO manufacturers (name, rating) VALUES ('Компания Б', 9);

-- Вставка данных в таблицу categories
INSERT INTO categories (name) VALUES ('Электроника');
INSERT INTO categories (name) VALUES ('Игрушки');

-- Вставка данных в таблицу models
INSERT INTO models (name, price, description, quantity, scale, id_manufacturers, id_categories) VALUES ('Модель 1', 1000, 'Описание модели 1', 50, '1:18', 1, 1);
INSERT INTO models (name, price, description, quantity, scale, id_manufacturers, id_categories) VALUES ('Модель 2', 2000, 'Описание модели 2', 30, '1:24', 2, 2);

-- Вставка данных в таблицу orders
INSERT INTO orders (date, id_models, id_personnel) VALUES ('2023-12-01', 1, 1);
INSERT INTO orders (date, id_models, id_personnel) VALUES ('2023-12-02', 2, 2);
