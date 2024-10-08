import csv
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Количество записей для каждой таблицы
NUM_USERS = 10000
NUM_CATEGORIES = 100
NUM_BRANDS = 50
NUM_PRODUCTS = 10000
NUM_ORDERS = 20000
NUM_ORDER_ITEMS = 50000
NUM_REVIEWS = 30000
NUM_PAYMENTS = NUM_ORDERS  # По одному платежу на заказ
NUM_DELIVERIES = NUM_ORDERS  # По одной доставке на заказ
NUM_CARTS = NUM_USERS  # По одной корзине на пользователя
NUM_CART_ITEMS = 20000

# 1. Генерация данных для UserAccount
users = []
roles = ['customer']  # Можно добавить 'admin', 'manager' при необходимости

for user_id in range(1, NUM_USERS + 1):
    username = f"user{user_id}"
    password = fake.password(length=10)
    email = f"user{user_id}@example.com"
    first_name = fake.first_name()
    last_name = fake.last_name()
    phone = fake.phone_number().replace('-', '')
    address = fake.address().replace('\n', ', ')
    role = random.choice(roles)
    users.append([user_id, username, password, email, first_name, last_name, phone, address, role])

with open('UserAccount.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['user_id', 'username', 'password', 'email', 'first_name', 'last_name', 'phone', 'address', 'role'])
    writer.writerows(users)

print("UserAccount.csv создан.")

# 2. Генерация данных для Category
categories = []
parent_categories = [None] * 10  # Первые 10 категорий верхнего уровня

for category_id in range(1, NUM_CATEGORIES + 1):
    category_name = f"Category {category_id}"
    description = fake.sentence()
    if category_id <= 10:
        parent_category_id = ''
    else:
        parent_category_id = random.randint(1, 10)
    categories.append([category_id, category_name, description, parent_category_id])

with open('Category.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['category_id', 'category_name', 'description', 'parent_category_id'])
    writer.writerows(categories)

print("Category.csv создан.")

# 3. Генерация данных для Brand
brands = []

for brand_id in range(1, NUM_BRANDS + 1):
    brand_name = f"Brand {brand_id}"
    rating = round(random.uniform(0, 5), 1)
    description = fake.sentence()
    brands.append([brand_id, brand_name, rating, description])

with open('Brand.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['brand_id', 'brand_name', 'rating', 'description'])
    writer.writerows(brands)

print("Brand.csv создан.")

# 4. Генерация данных для Product
products = []
status_choices = ['available', 'out_of_stock']

for product_id in range(1, NUM_PRODUCTS + 1):
    name = f"Product {product_id}"
    description = fake.sentence()
    price = round(random.uniform(10, 1000), 2)
    quantity_in_stock = random.randint(0, 100)
    status = random.choice(status_choices)
    category_id = random.randint(1, NUM_CATEGORIES)
    brand_id = random.randint(1, NUM_BRANDS)
    created_at = fake.date_time_between(start_date='-2y', end_date='now')
    products.append([product_id, name, description, price, quantity_in_stock, status, category_id, brand_id, created_at])

with open('Product.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['product_id', 'name', 'description', 'price', 'quantity_in_stock', 'status', 'category_id', 'brand_id', 'created_at'])
    writer.writerows(products)

print("Product.csv создан.")

# 5. Генерация данных для CustomerOrder
orders = []
order_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

for order_id in range(1, NUM_ORDERS + 1):
    user_id = random.randint(1, NUM_USERS)
    order_date = fake.date_time_between(start_date='-1y', end_date='now')
    status = random.choice(order_statuses)
    total_amount = 0  # Будет рассчитано позже
    orders.append([order_id, user_id, order_date, status, total_amount])

with open('CustomerOrder.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['order_id', 'user_id', 'order_date', 'status', 'total_amount'])
    writer.writerows(orders)

print("CustomerOrder.csv создан.")

# 6. Генерация данных для OrderItem
order_items = []

for order_item_id in range(1, NUM_ORDER_ITEMS + 1):
    order_id = random.randint(1, NUM_ORDERS)
    product_id = random.randint(1, NUM_PRODUCTS)
    quantity = random.randint(1, 5)
    price_per_unit = next((p[3] for p in products if p[0] == product_id), 0)
    order_items.append([order_item_id, order_id, product_id, quantity, price_per_unit])

with open('OrderItem.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['order_item_id', 'order_id', 'product_id', 'quantity', 'price_per_unit'])
    writer.writerows(order_items)

print("OrderItem.csv создан.")

# Обновление total_amount в заказах
order_totals = {}
for item in order_items:
    order_id = item[1]
    total_price = item[3] * item[4]
    if order_id in order_totals:
        order_totals[order_id] += total_price
    else:
        order_totals[order_id] = total_price

for order in orders:
    order_id = order[0]
    order[4] = round(order_totals.get(order_id, 0), 2)

# Перезапись файла CustomerOrder с обновленным total_amount
with open('CustomerOrder.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['order_id', 'user_id', 'order_date', 'status', 'total_amount'])
    writer.writerows(orders)

print("CustomerOrder.csv обновлен с total_amount.")

# 7. Генерация данных для Review
reviews = []

for review_id in range(1, NUM_REVIEWS + 1):
    product_id = random.randint(1, NUM_PRODUCTS)
    user_id = random.randint(1, NUM_USERS)
    rating = random.randint(1, 5)
    comment = fake.sentence()
    review_date = fake.date_time_between(start_date='-1y', end_date='now')
    reviews.append([review_id, product_id, user_id, rating, comment, review_date])

with open('Review.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['review_id', 'product_id', 'user_id', 'rating', 'comment', 'review_date'])
    writer.writerows(reviews)

print("Review.csv создан.")

# 8. Генерация данных для Payment
payments = []
payment_methods = ['card', 'cash']

for payment_id in range(1, NUM_PAYMENTS + 1):
    order_id = payment_id  # Предполагаем, что по одному платежу на заказ
    payment_date = next((o[2] for o in orders if o[0] == order_id), datetime.now())
    amount = next((o[4] for o in orders if o[0] == order_id), 0)
    payment_method = random.choice(payment_methods)
    payments.append([payment_id, order_id, payment_date, amount, payment_method])

with open('Payment.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['payment_id', 'order_id', 'payment_date', 'amount', 'payment_method'])
    writer.writerows(payments)

print("Payment.csv создан.")

# 9. Генерация данных для Delivery
deliveries = []
delivery_statuses = ['processing', 'in_transit', 'delivered', 'returned', 'cancelled']

for delivery_id in range(1, NUM_DELIVERIES + 1):
    order_id = delivery_id  # Предполагаем, что по одной доставке на заказ
    shipping_address = fake.address().replace('\n', ', ')
    tracking_number = f"TRACK{delivery_id:06d}"
    delivery_status = random.choice(delivery_statuses)
    delivery_date = next((o[2] for o in orders if o[0] == order_id), datetime.now()) + timedelta(days=random.randint(1, 14))
    deliveries.append([delivery_id, order_id, shipping_address, tracking_number, delivery_status, delivery_date])

with open('Delivery.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['delivery_id', 'order_id', 'shipping_address', 'tracking_number', 'delivery_status', 'delivery_date'])
    writer.writerows(deliveries)

print("Delivery.csv создан.")

# 10. Генерация данных для Cart
carts = []

for cart_id in range(1, NUM_CARTS + 1):
    user_id = cart_id  # По одной корзине на пользователя
    created_at = fake.date_time_between(start_date='-1y', end_date='now')
    carts.append([cart_id, user_id, created_at])

with open('Cart.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['cart_id', 'user_id', 'created_at'])
    writer.writerows(carts)

print("Cart.csv создан.")

# 11. Генерация данных для CartItem
cart_items = []

for cart_item_id in range(1, NUM_CART_ITEMS + 1):
    cart_id = random.randint(1, NUM_CARTS)
    product_id = random.randint(1, NUM_PRODUCTS)
    quantity = random.randint(1, 5)
    cart_items.append([cart_item_id, cart_id, product_id, quantity])

with open('CartItem.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['cart_item_id', 'cart_id', 'product_id', 'quantity'])
    writer.writerows(cart_items)

print("CartItem.csv создан.")

print("Генерация данных завершена.")
