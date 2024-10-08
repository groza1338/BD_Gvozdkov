CREATE TRIGGER update_product_status_on_stock_change
AFTER UPDATE OF quantity_in_stock ON Product
FOR EACH ROW
EXECUTE FUNCTION check_stock_and_update_status();

UPDATE Product
SET quantity_in_stock = 0
WHERE product_id = 1;

-- Проверка, что статус обновился на 'out_of_stock':
SELECT product_id, quantity_in_stock, status FROM Product WHERE product_id = 1;











