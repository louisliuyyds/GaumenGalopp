# controllers/restaurant_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.restaurant_service import RestaurantService
from schemas.restaurant_schema import RestaurantCreate, RestaurantUpdate, RestaurantResponse

router = APIRouter(
    prefix="/api/restaurants",
    tags=["restaurants"]
)

# GET /api/restaurants - Get all restaurants
@router.get("/", response_model=List[RestaurantResponse])
def get_all_restaurants(db: Session = Depends(get_db)):
    service = RestaurantService(db)
    restaurants = service.get_all()
    return restaurants

# GET /api/restaurants/{id} - Get specific restaurant
@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantService(db)
    restaurant = service.get_by_id(restaurant_id)
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurant_id} not found"
        )
    
    return restaurant

# POST /api/restaurants - Create new restaurant
@router.post("/", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(
    restaurant: RestaurantCreate,
    db: Session = Depends(get_db)
):
    service = RestaurantService(db)
    new_restaurant = service.create(restaurant.model_dump())
    return new_restaurant

# PUT /api/restaurants/{id} - Update restaurant
@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    restaurant_update: RestaurantUpdate,
    db: Session = Depends(get_db)
):
    service = RestaurantService(db)
    updated_restaurant = service.update(
        restaurant_id,
        restaurant_update.model_dump(exclude_unset=True)
    )
    
    if not updated_restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurant_id} not found"
        )
    
    return updated_restaurant

# DELETE /api/restaurants/{id} - Delete restaurant
@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantService(db)
    success = service.delete(restaurant_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurant_id} not found"
        )
    
    return None