from pydantic import BaseModel
from typing import Optional

class MenueCreate(BaseModel):
    name : str
    restaurantid: int

class MenueUpdate(BaseModel):
    name: Optional[str] = None

class MenueResponse(BaseModel):
    menuid: int
    restaurantid: int
    name: str

    class Config:
        from_attributes = True
