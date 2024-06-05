-- Переименование столбца Full_name в таблице personnel в full_name
ALTER TABLE personnel RENAME COLUMN full_name TO full_name_pers;

-- Переименование столбца name в таблице manufacturers в manufacturer_name
ALTER TABLE manufacturers RENAME COLUMN name TO manufacturer_name;

-- Переименование столбца start в таблице reviews в rating
ALTER TABLE reviews RENAME COLUMN start TO rating;
