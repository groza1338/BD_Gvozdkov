from fastapi import FastAPI, HTTPException, status, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal, engine, Base
from models import UserAccount
from sqlalchemy import inspect

# Конфигурация безопасности
SECRET_KEY = "secretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Контекст для хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# Конфигурация CORS
origins = [
    "*"
]

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
        data={"sub": username, "role": user.role.value},  # Преобразуем role в строку
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

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
