from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

db_port = os.getenv("DB_PORT", "5434")

db_address = os.getenv("DB_ADDRESS", "localhost")

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@" + db_address + ":"+db_port+"/gvozdkov_dns_v2"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
