# controllers/restaurant_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.restaurant_service import RestaurantService
from services.restaurant_oeffnungszeit_service import RestaurantOeffnungszeitService
from schemas.restaurant_schema import (
    RestaurantCreate,
    RestaurantUpdate,
    RestaurantResponse,
    RestaurantProfileResponse,
    RestaurantProfileUpdate,
)
from schemas.restaurant_oeffnungszeit_schema import (
    RestaurantOpeningProfileResponse,
    RestaurantOpeningProfileUpdate,
)

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

# GET /api/restaurants/{restaurant_id} - Get specific restaurant
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

# PUT /api/restaurants/{restaurant_id} - Update restaurant
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

# DELETE /api/restaurants/{restaurant_id} - Delete restaurant
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


# GET /api/restaurants/{restaurant_id}/profil - Get restaurant with address
@router.get("/{restaurant_id}/profil", response_model=RestaurantProfileResponse)
def get_restaurant_profile(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantService(db)
    restaurant = service.get_profile(restaurant_id)

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurant_id} not found"
        )

    return restaurant


# PUT /api/restaurants/{restaurant_id}/profil - Update restaurant incl. address
@router.put("/{restaurant_id}/profil", response_model=RestaurantProfileResponse)
def update_restaurant_profile(
    restaurant_id: int,
    profile_update: RestaurantProfileUpdate,
    db: Session = Depends(get_db)
):
    service = RestaurantService(db)
    restaurant_payload = profile_update.model_dump(exclude={"adresse"}, exclude_unset=True)
    adresse_payload = (
        profile_update.adresse.model_dump(exclude_unset=True)
        if profile_update.adresse
        else None
    )

    updated_restaurant = service.update_profile(restaurant_id, restaurant_payload, adresse_payload)

    if not updated_restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurant_id} not found"
        )

    return updated_restaurant


@router.get("/{restaurant_id}/oeffnungszeiten", response_model=RestaurantOpeningProfileResponse)
def get_restaurant_opening_profile(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantOeffnungszeitService(db)
    assignment = service.get_profile_for_restaurant(restaurant_id)

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No opening hours found for restaurant {restaurant_id}"
        )

    return assignment


@router.put("/{restaurant_id}/oeffnungszeiten", response_model=RestaurantOpeningProfileResponse)
def update_restaurant_opening_profile(
    restaurant_id: int,
    opening_update: RestaurantOpeningProfileUpdate,
    db: Session = Depends(get_db)
):
    service = RestaurantOeffnungszeitService(db)
    assignment_data = opening_update.model_dump(exclude={"vorlage"}, exclude_unset=True)
    vorlage_payload = opening_update.vorlage.model_dump()

    updated_assignment = service.upsert_profile_for_restaurant(
        restaurant_id,
        assignment_data,
        vorlage_payload
    )

    if not updated_assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opening hours for restaurant {restaurant_id} not found"
        )

    return updated_assignment