-- Удаление внешнего ключа из таблицы models_to_wishlists
ALTER TABLE models_to_wishlists
DROP CONSTRAINT fk_models_to_wishlists_models;

-- Изменение внешнего ключа в таблице couriers
ALTER TABLE couriers
DROP CONSTRAINT fk_couriers_buyers,
ADD CONSTRAINT fk_couriers_buyers_new
FOREIGN KEY (id_buyers) REFERENCES buyers(id_buyers) ON DELETE CASCADE;
