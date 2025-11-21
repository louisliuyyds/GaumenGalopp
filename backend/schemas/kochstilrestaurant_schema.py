from pydantic import BaseModel

class KochstilRestaurantCreate(BaseModel):
    restaurantid: int
    stilid: int

class KochstilRestaurantResponse(BaseModel):
    restaurantid: int
    stilid: int

    class Config:
        from_attributes = True