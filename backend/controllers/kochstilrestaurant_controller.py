from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Code.backend.database import get_db
from Code.backend.services.kochstilrestaurant_service import KochstilRestaurantService
from Code.backend.schemas.kochstilrestaurant_schema import KochstilRestaurantCreate, KochstilRestaurantResponse

router = APIRouter(
    prefix="/api/kochstil-restaurants",
    tags=["kochstil-restaurants"]
)

@router.post("/", response_model=KochstilRestaurantResponse, status_code=status.HTTP_201_CREATED)
def assign_kochstil_to_restaurant(
        assignment: KochstilRestaurantCreate,
        db: Session = Depends(get_db)
):
    service = KochstilRestaurantService(db)
    result = service.assign_kochstil_to_restaurant(
        assignment.restaurantid,
        assignment.stilid
    )
    return result

@router.delete("/restaurant/{restaurant_id}/kochstil/{stil_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_kochstil_from_restaurant(
        restaurant_id: int,
        stil_id: int,
        db: Session = Depends(get_db)
):
    service = KochstilRestaurantService(db)
    success = service.remove_kochstil_from_restaurant(restaurant_id, stil_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment not found"
        )

    return None

@router.get("/restaurant/{restaurant_id}", response_model=List[KochstilRestaurantResponse])
def get_kochstile_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = KochstilRestaurantService(db)
    kochstile = service.get_kochstile_by_restaurant(restaurant_id)
    return kochstile

@router.get("/kochstil/{stil_id}", response_model=List[KochstilRestaurantResponse])
def get_restaurants_by_kochstil(stil_id: int, db: Session = Depends(get_db)):
    service = KochstilRestaurantService(db)
    restaurants = service.get_restaurants_by_kochstil(stil_id)
    return restaurants