CREATE OR REPLACE FUNCTION get_category_stock(
    category_id_param INT
) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    total_stock INT := 0;
BEGIN
    -- Суммируем количество на складе для указанной категории
    SELECT COALESCE(SUM(quantity_in_stock), 0) INTO total_stock
    FROM Product
    WHERE category_id = category_id_param;

    RETURN total_stock;
END;
$$;

SELECT get_category_stock(3);  -- Возвращает общее количество товаров на складе для категории с ID 3

CREATE OR REPLACE FUNCTION get_product_rating(
    product_id_param INT
) RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    avg_rating NUMERIC := 0;
BEGIN
    -- Вычисляем средний рейтинг для указанного товара
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM Review
    WHERE product_id = product_id_param;

    RETURN avg_rating;
END;
$$;

SELECT get_product_rating(50);  -- Возвращает средний рейтинг для товара с ID 50

CREATE OR REPLACE FUNCTION is_product_in_stock(
    product_id_param INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    stock_count INT := 0;
BEGIN
    -- Проверяем количество на складе для указанного товара
    SELECT quantity_in_stock INTO stock_count
    FROM Product
    WHERE product_id = product_id_param;

    RETURN stock_count > 0;
END;
$$;

SELECT is_product_in_stock(50);  -- Возвращает TRUE, если товар с ID 50 в наличии, иначе FALSE

CREATE OR REPLACE FUNCTION check_stock_and_update_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Если количество на складе становится нулевым, устанавливаем статус "out_of_stock"
    IF NEW.quantity_in_stock = 0 THEN
        UPDATE Product
        SET status = 'out_of_stock'
        WHERE product_id = NEW.product_id;

    -- Если количество больше нуля, устанавливаем статус "available"
    ELSIF NEW.quantity_in_stock > 0 THEN
        UPDATE Product
        SET status = 'available'
        WHERE product_id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
