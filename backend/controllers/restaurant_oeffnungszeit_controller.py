# controllers/restaurant_oeffnungszeit_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from database import get_db
from services.restaurant_oeffnungszeit_service import RestaurantOeffnungszeitService
from schemas.restaurant_oeffnungszeit_schema import (
    RestaurantOeffnungszeitCreate, 
    RestaurantOeffnungszeitUpdate, 
    RestaurantOeffnungszeitResponse
)

router = APIRouter(
    prefix="/api/restaurant-oeffnungszeit",
    tags=["restaurant-oeffnungszeit"]
)

# GET /api/restaurant-oeffnungszeit - Get all
@router.get("/", response_model=List[RestaurantOeffnungszeitResponse])
def get_all_restaurant_oeffnungszeit(db: Session = Depends(get_db)):
    service = RestaurantOeffnungszeitService(db)
    items = service.get_all()
    return items

# GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id} - Get all for restaurant
@router.get("/restaurant/{restaurantid}", response_model=List[RestaurantOeffnungszeitResponse])
def get_for_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantOeffnungszeitService(db)
    items = service.get_by_restaurant_id(restaurant_id)
    return items

# GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id}/active - Get active for restaurant
@router.get("/restaurant/{restaurantid}/active", response_model=List[RestaurantOeffnungszeitResponse])
def get_active_for_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantOeffnungszeitService(db)
    items = service.get_active_by_restaurant_id(restaurant_id)
    return items

# GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id}/current - Get current for restaurant
@router.get("/restaurant/{restaurantid}/current", response_model=RestaurantOeffnungszeitResponse)
def get_current_for_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantOeffnungszeitService(db)
    item = service.get_current_for_restaurant(restaurant_id)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No current opening hours found for restaurant {restaurant_id}"
        )
    
    return item

# POST /api/restaurant-oeffnungszeit - Create new assignment
@router.post("/", response_model=RestaurantOeffnungszeitResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant_oeffnungszeit(
    item: RestaurantOeffnungszeitCreate,
    db: Session = Depends(get_db)
):
    service = RestaurantOeffnungszeitService(db)
    new_item = service.create(item.model_dump())
    return new_item

# PUT /api/restaurant-oeffnungszeit/{restaurant_id}/{oeffnungszeit_id}/{gueltig_von} - Update
@router.put("/{restaurantid}/{oeffnungszeitid}/{gueltig_von}", response_model=RestaurantOeffnungszeitResponse)
def update_restaurant_oeffnungszeit(
    restaurant_id: int,
    oeffnungszeit_id: int,
    gueltig_von: date,
    item_update: RestaurantOeffnungszeitUpdate,
    db: Session = Depends(get_db)
):
    service = RestaurantOeffnungszeitService(db)
    updated_item = service.update(
        restaurant_id,
        oeffnungszeit_id,
        gueltig_von,
        item_update.model_dump(exclude_unset=True)
    )
    
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment not found"
        )
    
    return updated_item

# DELETE /api/restaurant-oeffnungszeit/{restaurant_id}/{oeffnungszeit_id}/{gueltig_von} - Delete
@router.delete("/{restaurantid}/{oeffnungszeitid}/{gueltig_von}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant_oeffnungszeit(
    restaurant_id: int, 
    oeffnungszeit_id: int, 
    gueltig_von: date, 
    db: Session = Depends(get_db)
):
    service = RestaurantOeffnungszeitService(db)
    success = service.delete(restaurant_id, oeffnungszeit_id, gueltig_von)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment not found"
        )
    
    return None