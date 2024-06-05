-- Добавление внешнего ключа в таблицу models_to_wishlists
ALTER TABLE models_to_wishlists
ADD CONSTRAINT fk_models_to_wishlists_models
FOREIGN KEY (id_models) REFERENCES models(id_models);

-- Добавление внешнего ключа в таблицу couriers
ALTER TABLE couriers
ADD CONSTRAINT fk_couriers_buyers
FOREIGN KEY (id_buyers) REFERENCES buyers(id_buyers);

-- Добавление внешнего ключа в таблицу deliveries
ALTER TABLE deliveries
ADD CONSTRAINT fk_deliveries_orders
FOREIGN KEY (id_orders) REFERENCES orders(id_orders);
