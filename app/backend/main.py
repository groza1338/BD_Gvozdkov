from fastapi import FastAPI, HTTPException, status, Body, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, ValidationError, validator
from jose import jwt, JWTError
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal, engine, Base
from models import UserAccount
from sqlalchemy import inspect, Table, MetaData, or_
import re
from deep_translator import GoogleTranslator
from typing import List, Optional

# Конфигурация безопасности
SECRET_KEY = "secretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Контекст для хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

metadata = MetaData()
metadata.reflect(bind=engine)

# Конфигурация CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Модель токена
class Token(BaseModel):
    access_token: str
    token_type: str


# Модель пользователя
class User(BaseModel):
    username: str
    role: str


# Функция для создания токена
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Функция для проверки пароля
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Функция для хэширования пароля
def get_password_hash(password):
    return pwd_context.hash(password)


# Инициализация базы данных
Base.metadata.create_all(bind=engine)


# Функция для получения сессии
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Функция для создания или обновления учетной записи администратора
@app.on_event("startup")
def create_or_update_admin_account():
    db = SessionLocal()
    try:
        admin = db.query(UserAccount).filter(UserAccount.username == "admin").first()
        hashed_password = get_password_hash("admin")

        if not admin:
            new_admin = UserAccount(
                username="admin",
                password=hashed_password,
                email="admin@example.com",
                role="admin"
            )
            db.add(new_admin)
            db.commit()
            print("Учётная запись администратора создана.")
        else:
            admin.password = hashed_password
            db.commit()
            print("Пароль учётной записи администратора обновлен.")
    finally:
        db.close()


# Эндпоинт для авторизации
@app.post("/token", response_model=Token)
def login_for_access_token(
        username: str = Body(...),
        password: str = Body(...),
        db: Session = Depends(get_db)
):
    user = db.query(UserAccount).filter(UserAccount.username == username).first()
    if user is None or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(
        data={"sub": username, "role": user.role.value},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Модель регистрации пользователя с валидаторами
class UserRegister(BaseModel):
    username: str
    password: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    address: str

    @validator("username")
    def validate_username(cls, v):
        if not re.match("^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username must contain only letters, numbers, and underscores")
        return v

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v


# Эндпоинт для регистрации нового пользователя с проверкой ошибок
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    errors = []

    # Проверка на уникальность имени пользователя
    existing_user = db.query(UserAccount).filter(UserAccount.username == user.username).first()
    if existing_user:
        errors.append("Username is already taken")

    # Проверка на уникальность email
    existing_email = db.query(UserAccount).filter(UserAccount.email == user.email).first()
    if existing_email:
        errors.append("Email is already registered")

    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors
        )

    # Хэшируем пароль
    hashed_password = pwd_context.hash(user.password)

    # Создаем новый объект пользователя
    new_user = UserAccount(
        username=user.username,
        password=hashed_password,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        address=user.address,
        role="customer"
    )

    # Добавляем пользователя в базу данных
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


# Эндпоинт для получения информации о текущем пользователе
@app.get("/me", response_model=User)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(UserAccount).filter(UserAccount.username == username).first()
    if user is None:
        raise credentials_exception
    return {"username": user.username, "role": user.role.value}

# Эндпоинт для получения списка таблиц
@app.get("/tables")
def get_tables(db: Session = Depends(get_db)):
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return {"tables": tables}


# Обновленный эндпоинт для получения данных таблицы с фильтрацией
@app.get("/data/{table_name}")
def read_table_data(
        table_name: str,
        db: Session = Depends(get_db),
        filters: Optional[str] = Query(None),
        limit: int = 50,
        offset: int = 0
):
    if table_name not in metadata.tables:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")

    table = Table(table_name, metadata, autoload_with=engine)
    query = db.query(table)

    if filters:
        filter_criteria = []
        for filter_pair in filters.split(","):
            column, value = filter_pair.split("=")
            if value:
                filter_criteria.append(getattr(table.c, column) == value)
        if filter_criteria:
            query = query.filter(or_(*filter_criteria))

    result = query.limit(limit).offset(offset).all()
    rows = [dict(row._mapping) for row in result]
    return {"rows": rows}


# Эндпоинт для получения столбцов таблицы
@app.get("/columns/{table_name}")
def get_table_columns(table_name: str):
    inspector = inspect(engine)
    columns = [column['name'] for column in inspector.get_columns(table_name)]
    return {"columns": columns}


# Эндпоинт для добавления строки
@app.post("/data/{table_name}")
def create_table_row(table_name: str, row_data: dict, db: Session = Depends(get_db)):
    table = Table(table_name, metadata, autoload_with=engine)

    # Проверяем автоинкрементные столбцы и исключаем их из запроса
    auto_increment_columns = [col.name for col in table.columns if col.autoincrement]

    # Убираем все автоинкрементные поля, если они есть в данных запроса
    for col in auto_increment_columns:
        row_data.pop(col, None)

    # Получаем обязательные столбцы и проверяем, что все обязательные поля заполнены
    required_columns = [col.name for col in table.columns if
                        not col.nullable and col.default is None and not col.autoincrement]
    missing_columns = [col for col in required_columns if col not in row_data]

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing_columns)}"
        )

    insert_stmt = table.insert().values(**row_data)
    db.execute(insert_stmt)
    db.commit()
    return {"message": "Row added successfully"}


# Эндпоинт для обновления строки с проверкой ошибок
@app.put("/data/{table_name}/{item_id}")
def update_table_row(table_name: str, item_id: int, row_data: dict, db: Session = Depends(get_db)):
    if table_name not in metadata.tables:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")

    table = Table(table_name, metadata, autoload_with=engine)
    stmt = db.query(table).filter(table.c[table.primary_key.columns.keys()[0]] == item_id)
    if not db.query(stmt.exists()).scalar():
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found in table '{table_name}'")

    try:
        update_stmt = table.update().where(table.c[table.primary_key.columns.keys()[0]] == item_id).values(**row_data)
        db.execute(update_stmt)
        db.commit()
        return {"message": "Row updated successfully"}
    except Exception as e:
        error_in_English = e.args[0]
        error_in_Russian = GoogleTranslator(source='en', target='ru').translate(error_in_English)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error_in_Russian if error_in_Russian else e.args[0])
        )


# Эндпоинт для удаления записи
@app.delete("/data/{table_name}/{item_id}")
def delete_table_item(table_name: str, item_id: int, db: Session = Depends(get_db)):
    if table_name not in metadata.tables:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")

    table = Table(table_name, metadata, autoload_with=engine)
    stmt = db.query(table).filter(table.c[table.primary_key.columns.keys()[0]] == item_id)
    if not db.query(stmt.exists()).scalar():
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found in table '{table_name}'")

    delete_stmt = table.delete().where(table.c[table.primary_key.columns.keys()[0]] == item_id)
    db.execute(delete_stmt)
    db.commit()
    return {"message": f"Item with id {item_id} deleted from table '{table_name}'"}

# Эндпоинт для получения полей таблицы useraccount
@app.get("/useraccount/fields")
def get_useraccount_fields():
    inspector = inspect(engine)
    columns = inspector.get_columns("useraccount")
    fields = [{"name": column["name"], "nullable": column["nullable"]} for column in columns if column["name"] not in ["user_id", "role"]]
    return {"fields": fields}
