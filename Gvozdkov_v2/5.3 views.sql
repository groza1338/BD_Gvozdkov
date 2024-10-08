CREATE OR REPLACE VIEW view_product_details AS
SELECT
    p.product_id,
    p.name AS product_name,
    p.description,
    p.price,
    p.quantity_in_stock,
    p.status,
    c.category_name,
    b.brand_name
FROM
    Product p
JOIN
    Category c ON p.category_id = c.category_id
JOIN
    Brand b ON p.brand_id = b.brand_id;

SELECT * FROM view_product_details;

CREATE OR REPLACE VIEW view_order_summary AS
SELECT
    o.order_id,
    o.order_date,
    o.status AS order_status,
    o.total_amount,
    u.username,
    u.email
FROM
    CustomerOrder o
JOIN
    UserAccount u ON o.user_id = u.user_id;

SELECT * FROM view_order_summary;

CREATE OR REPLACE VIEW view_product_reviews AS
SELECT
    p.product_id,
    p.name AS product_name,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(r.review_id) AS review_count
FROM
    Product p
LEFT JOIN
    Review r ON p.product_id = r.product_id
GROUP BY
    p.product_id, p.name;

SELECT * FROM view_product_reviews;





