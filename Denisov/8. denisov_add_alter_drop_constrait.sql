-- Добавление уникального ограничения на столбец email в таблице buyers
ALTER TABLE buyers
ADD CONSTRAINT unique_email UNIQUE (email);

-- Изменение ограничения CHECK на столбец rating в таблице manufacturers
ALTER TABLE manufacturers
DROP CONSTRAINT IF EXISTS check_rating,
ADD CONSTRAINT check_rating_new CHECK (rating BETWEEN 0 AND 10);

-- Удаление ограничения NOT NULL на столбец Full_name в таблице personnel
ALTER TABLE personnel
ALTER COLUMN Full_name DROP NOT NULL;
