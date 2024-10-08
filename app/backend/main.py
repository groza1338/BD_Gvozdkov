from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str
    price: float
    quantity_in_stock: int

# Пример CRUD операции
@app.get("/items/", response_model=List[Item])
async def read_items():
    return [{"name": "Sample Item", "description": "A sample item", "price": 10.0, "quantity_in_stock": 5}]
