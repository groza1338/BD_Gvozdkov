-- Удаление всех таблиц
DROP TABLE IF EXISTS models_to_wishlists;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS couriers;
DROP TABLE IF EXISTS buyers cascade;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS manufacturers;
DROP TABLE IF EXISTS personnel;
DROP TABLE IF EXISTS wishlists;

-- Удаление базы данных
DROP DATABASE IF EXISTS shop_denisov;
