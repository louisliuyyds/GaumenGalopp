# schemas/warenkorb_schema.py
from pydantic import BaseModel
from typing import Optional, List

class AddItemRequest(BaseModel):
    restaurantid: int
    gerichtid: int
    preisid: int
    menge: int = 1
    aenderungswunsch: Optional[str] = None

class UpdateQuantityRequest(BaseModel):
    menge: int

class UpdateSpecialRequestRequest(BaseModel):
    aenderungswunsch: str

class CheckoutRequest(BaseModel):
    adressid: int
    lieferantid: int

class CartItemResponse(BaseModel):
    positionid: int
    gerichtid: int
    name: str
    beschreibung: str
    preis: float
    menge: int
    aenderungswunsch: Optional[str]
    item_total: float

class CartResponse(BaseModel):
    bestellungid: int
    restaurantid: Optional[int]
    items: List[CartItemResponse]
    subtotal: float
    item_count: int