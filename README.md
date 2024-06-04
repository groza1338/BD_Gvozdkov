# БД

## Интернет-магазин электроники

### ER-диаграмма

```mermaid
erDiagram
    CUSTOMER {
        int id PK
        varchar first_name
        varchar second_name
        varchar email
        varchar phone_number
        varchar password
    }
    
    CUSTOMER_CARDS {
        int id PK
        varchar card_number
        varchar cardholder_name
        date expiration_date
        varchar cvv
        varchar card_type
        boolean is_active
    }
    
    CUSTOMER_CARD_RELATIONSHIP {
        int customer_id FK
        int card_id FK
    }
    
    CATEGORIES {
        int id PK
        varchar name
        int parent_category_id FK
    }
    
    PRODUCT_ATTRIBUTES {
        int id PK
        varchar attribute_name
        varchar attribute_value
    }
    
    PRODUCTS {
        int id PK
        varchar name
        text description
        int price
        varchar manufacturer
        varchar country_of_origin
        int category_id FK
    }
    
    PRODUCT_ATTRIBUTE_RELATIONSHIP {
        int product_id FK
        int attribute_id FK
    }
    
    REVIEWS {
        int id PK
        int product_id FK
        int customer_id FK
        int rating
        text comment
        timestamp date_posted
    }
    
    CART {
        int id PK
        int customer_id FK
        int product_id FK
        int quantity
    }
    
    WISHLIST {
        int id PK
        int customer_id FK
        int product_id FK
    }
    
    ORDERS {
        int id PK
        int customer_id FK
        timestamp order_date
    }
    
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        int total_amount
    }
    
    DELIVERY {
        int id PK
        int order_id FK
        varchar country
        varchar city
        varchar postal_code
        varchar street_name
        varchar building_number
        varchar apartment_number
        timestamp delivery_date
        boolean is_delivered
    }
    
    CUSTOMER ||--o{ CUSTOMER_CARD_RELATIONSHIP : has
    CUSTOMER_CARDS ||--o{ CUSTOMER_CARD_RELATIONSHIP : links
    CATEGORIES ||--|{ CATEGORIES : has
    CATEGORIES ||--o{ PRODUCTS : includes
    PRODUCTS ||--o{ REVIEWS : has
    PRODUCTS ||--o{ CART : in
    PRODUCTS ||--o{ WISHLIST : in
    PRODUCTS ||--o{ ORDER_ITEMS : included
    PRODUCTS ||--o{ PRODUCT_ATTRIBUTE_RELATIONSHIP : has
    PRODUCT_ATTRIBUTES ||--o{ PRODUCT_ATTRIBUTE_RELATIONSHIP : associated
    CUSTOMER ||--o{ REVIEWS : writes
    CUSTOMER ||--o{ CART : owns
    CUSTOMER ||--o{ WISHLIST : owns
    CUSTOMER ||--o{ ORDERS : makes
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--|{ DELIVERY : for
```