-- Добавление первичного ключа в таблицу models_to_wishlists
ALTER TABLE models_to_wishlists
ADD PRIMARY KEY (id_models, id_wishlist);

-- Изменение первичного ключа в таблице reviews
ALTER TABLE reviews
DROP CONSTRAINT reviews_pkey,
ADD CONSTRAINT reviews_pkey_new PRIMARY KEY (id_reviews, id_buyers);

-- Удаление первичного ключа в таблице wishlists с использованием CASCADE
ALTER TABLE wishlists
DROP CONSTRAINT wishlists_pkey CASCADE;

