from sqlalchemy import Column, Integer, String, Enum, Numeric, ForeignKey, Text, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from enum import Enum as PyEnum


# Определение типов перечислений
class UserRoleEnum(PyEnum):
    admin = "admin"
    customer = "customer"


class ProductStatusEnum(PyEnum):
    available = "available"
    out_of_stock = "out_of_stock"


class OrderStatusEnum(PyEnum):
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class PaymentMethodEnum(PyEnum):
    card = "card"
    cash = "cash"


class DeliveryStatusEnum(PyEnum):
    processing = "processing"
    in_transit = "in_transit"
    delivered = "delivered"
    returned = "returned"
    cancelled = "cancelled"


# Модель пользователя
class UserAccount(Base):
    __tablename__ = "useraccount"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    role = Column(Enum(UserRoleEnum), nullable=False)

    orders = relationship("CustomerOrder", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    cart = relationship("Cart", uselist=False, back_populates="user")


# Модель категории
class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    parent_category_id = Column(Integer, ForeignKey('category.category_id'))

    products = relationship("Product", back_populates="category")
    parent_category = relationship("Category", remote_side=[category_id])


# Модель бренда
class Brand(Base):
    __tablename__ = "brand"

    brand_id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String(100), unique=True, nullable=False)
    rating = Column(Numeric(2, 1))
    description = Column(Text)

    products = relationship("Product", back_populates="brand")


# Модель продукта
class Product(Base):
    __tablename__ = "product"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    quantity_in_stock = Column(Integer, nullable=False)
    status = Column(Enum(ProductStatusEnum), nullable=False)
    category_id = Column(Integer, ForeignKey('category.category_id'))
    brand_id = Column(Integer, ForeignKey('brand.brand_id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")


# Модель заказа
class CustomerOrder(Base):
    __tablename__ = "customerorder"

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('useraccount.user_id'), nullable=False)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(OrderStatusEnum), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)

    user = relationship("UserAccount", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    payment = relationship("Payment", uselist=False, back_populates="order")
    delivery = relationship("Delivery", uselist=False, back_populates="order")


# Модель элемента заказа
class OrderItem(Base):
    __tablename__ = "orderitem"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('customerorder.order_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('product.product_id'))
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(Numeric(10, 2), nullable=False)

    order = relationship("CustomerOrder", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")


# Модель отзыва
class Review(Base):
    __tablename__ = "review"

    review_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.product_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('useraccount.user_id'), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    review_date = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="reviews")
    user = relationship("UserAccount", back_populates="reviews")


# Модель платежа
class Payment(Base):
    __tablename__ = "payment"

    payment_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('customerorder.order_id'), nullable=False)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethodEnum), nullable=False)

    order = relationship("CustomerOrder", back_populates="payment")


# Модель доставки
class Delivery(Base):
    __tablename__ = "delivery"

    delivery_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('customerorder.order_id'), nullable=False)
    shipping_address = Column(Text, nullable=False)
    tracking_number = Column(String(50))
    delivery_status = Column(Enum(DeliveryStatusEnum), nullable=False)
    delivery_date = Column(Date)

    order = relationship("CustomerOrder", back_populates="delivery")


# Модель корзины
class Cart(Base):
    __tablename__ = "cart"

    cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('useraccount.user_id'), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("UserAccount", back_populates="cart")
    cart_items = relationship("CartItem", back_populates="cart")


# Модель элемента корзины
class CartItem(Base):
    __tablename__ = "cartitem"

    cart_item_id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('cart.cart_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('product.product_id'))
    quantity = Column(Integer, nullable=False)

    cart = relationship("Cart", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")
