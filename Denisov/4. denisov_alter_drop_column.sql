-- Изменение типа данных столбца rating в таблице manufacturers
ALTER TABLE manufacturers ALTER COLUMN rating TYPE float;

-- Удаление столбца description из таблицы models
ALTER TABLE models DROP COLUMN description;

-- Изменение типа данных столбца address в таблице deliveries
ALTER TABLE deliveries ALTER COLUMN address TYPE varchar(100);
