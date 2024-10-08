CREATE OR REPLACE PROCEDURE add_product_to_cart(
    IN cart_user_id INT,
    IN cart_product_id INT,
    IN cart_quantity INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    existing_cart_id INT;
    existing_quantity INT;
BEGIN
    -- Проверяем, есть ли корзина для данного пользователя
    SELECT cart_id INTO existing_cart_id
    FROM Cart
    WHERE Cart.user_id = cart_user_id;

    IF existing_cart_id IS NULL THEN
        -- Создаем корзину, если её нет
        INSERT INTO Cart(user_id, created_at)
        VALUES (cart_user_id, NOW())
        RETURNING cart_id INTO existing_cart_id;
    END IF;

    -- Проверяем, есть ли уже такой товар в корзине
    SELECT quantity INTO existing_quantity
    FROM CartItem
    WHERE cart_id = existing_cart_id AND product_id = cart_product_id;

    IF existing_quantity IS NOT NULL THEN
        -- Увеличиваем количество, если товар уже есть
        UPDATE CartItem
        SET quantity = cart_quantity + existing_quantity
        WHERE cart_id = existing_cart_id AND product_id = cart_product_id;
    ELSE
        -- Иначе добавляем товар в корзину
        INSERT INTO CartItem(cart_id, product_id, quantity)
        VALUES (existing_cart_id, cart_product_id, cart_quantity);
    END IF;
END;
$$;

CALL add_product_to_cart(1, 50, 3);

CREATE OR REPLACE PROCEDURE update_order_status(
    IN order_id_param INT,
    IN new_status_param orderstatusenum
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_delivery_date DATE;
BEGIN
    -- Обновляем статус заказа
    UPDATE CustomerOrder
    SET status = new_status_param
    WHERE order_id = order_id_param;

    -- Устанавливаем дату доставки, если заказ доставлен
    IF new_status_param = 'delivered' THEN
        current_delivery_date := NOW();
        UPDATE Delivery
        SET delivery_status = 'delivered', delivery_date = current_delivery_date
        WHERE order_id = order_id_param;
    END IF;
END;
$$;


CALL update_order_status(1, 'delivered');

CREATE OR REPLACE PROCEDURE increase_stock_for_category(
    IN category_id_param INT,     -- ID категории, для которой нужно увеличить запас
    IN additional_stock INT       -- Количество единиц, на которое нужно увеличить запас
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Проверка допустимости значения
    IF additional_stock <= 0 THEN
        RAISE EXCEPTION 'Additional stock must be positive';
    END IF;

    -- Увеличиваем количество товаров на складе для всех товаров указанной категории
    UPDATE Product
    SET quantity_in_stock = quantity_in_stock + additional_stock,
        status = CASE WHEN quantity_in_stock + additional_stock > 0 THEN 'available' ELSE status END
    WHERE category_id = category_id_param;

    -- Сообщение о завершении процедуры
    RAISE NOTICE 'Stock increased by % for category ID %', additional_stock, category_id_param;
END;
$$;


CALL increase_stock_for_category(3, 50);  -- Увеличивает количество товаров в категории с ID 3 на 50 единиц

