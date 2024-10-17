COPY UserAccount(user_id, username, password, email, first_name, last_name, phone, address, role)
FROM '/csv_files/UserAccount.csv' DELIMITER ',' CSV HEADER;

COPY Category(category_id, category_name, description, parent_category_id)
FROM '/csv_files/Category.csv' DELIMITER ',' CSV HEADER NULL '';

COPY Brand(brand_id, brand_name, rating, description)
FROM '/csv_files/Brand.csv' DELIMITER ',' CSV HEADER;

COPY Product(product_id, name, description, price, quantity_in_stock, status, category_id, brand_id, created_at)
FROM '/csv_files/Product.csv' DELIMITER ',' CSV HEADER;

COPY CustomerOrder(order_id, user_id, order_date, status, total_amount)
FROM '/csv_files/CustomerOrder.csv' DELIMITER ',' CSV HEADER;

COPY OrderItem(order_item_id, order_id, product_id, quantity, price_per_unit)
FROM '/csv_files/OrderItem.csv' DELIMITER ',' CSV HEADER;

COPY Review(review_id, product_id, user_id, rating, comment, review_date)
FROM '/csv_files/Review.csv' DELIMITER ',' CSV HEADER;

COPY Payment(payment_id, order_id, payment_date, amount, payment_method)
FROM '/csv_files/Payment.csv' DELIMITER ',' CSV HEADER;

COPY Delivery(delivery_id, order_id, shipping_address, tracking_number, delivery_status, delivery_date)
FROM '/csv_files/Delivery.csv' DELIMITER ',' CSV HEADER;

COPY Cart(cart_id, user_id, created_at)
FROM '/csv_files/Cart.csv' DELIMITER ',' CSV HEADER;

COPY CartItem(cart_item_id, cart_id, product_id, quantity)
FROM '/csv_files/CartItem.csv' DELIMITER ',' CSV HEADER;

-- UserAccount
SELECT setval('useraccount_user_id_seq', COALESCE((SELECT MAX(user_id) FROM UserAccount), 1), true);

-- Category
SELECT setval('category_category_id_seq', COALESCE((SELECT MAX(category_id) FROM Category), 1), true);

-- Brand
SELECT setval('brand_brand_id_seq', COALESCE((SELECT MAX(brand_id) FROM Brand), 1), true);

-- Product
SELECT setval('product_product_id_seq', COALESCE((SELECT MAX(product_id) FROM Product), 1), true);

-- CustomerOrder
SELECT setval('customerorder_order_id_seq', COALESCE((SELECT MAX(order_id) FROM CustomerOrder), 1), true);

-- OrderItem
SELECT setval('orderitem_order_item_id_seq', COALESCE((SELECT MAX(order_item_id) FROM OrderItem), 1), true);

-- Review
SELECT setval('review_review_id_seq', COALESCE((SELECT MAX(review_id) FROM Review), 1), true);

-- Payment
SELECT setval('payment_payment_id_seq', COALESCE((SELECT MAX(payment_id) FROM Payment), 1), true);

-- Delivery
SELECT setval('delivery_delivery_id_seq', COALESCE((SELECT MAX(delivery_id) FROM Delivery), 1), true);

-- Cart
SELECT setval('cart_cart_id_seq', COALESCE((SELECT MAX(cart_id) FROM Cart), 1), true);

-- CartItem
SELECT setval('cartitem_cart_item_id_seq', COALESCE((SELECT MAX(cart_item_id) FROM CartItem), 1), true);
