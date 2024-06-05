-- Добавление столбца phone_number в таблицу buyers
ALTER TABLE buyers ADD COLUMN phone_number varchar(20);

-- Добавление столбца delivery_date в таблицу deliveries
ALTER TABLE deliveries ADD COLUMN delivery_date date;

-- Добавление столбца discount в таблицу models
ALTER TABLE models ADD COLUMN discount int;
