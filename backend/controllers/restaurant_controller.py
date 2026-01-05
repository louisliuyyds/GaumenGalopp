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

# GET /api/restaurants - Get all restaurants WITH addresses AND kochstil
@router.get("/")
def get_all_restaurants(db: Session = Depends(get_db)):
    service = RestaurantService(db)
    restaurants = service.get_all()


    return [
        {
            "restaurantid": r.restaurantid,
            "name": r.name,
            "klassifizierung": r.klassifizierung,
            "adresseid": r.adresseid,
            "telefon": r.telefon,
            "kuechenchef": r.kuechenchef,
            # Adresse
            "adresse": {
                "adresseid": r.adresse.adresseid,
                "straße": r.adresse.straße,
                "hausnummer": r.adresse.hausnummer,
                "postleitzahl": r.adresse.postleitzahl,
                "ort": r.adresse.ort,
                "land": r.adresse.land
            } if r.adresse else None,

            "kochstile": [
                {
                    "stilid": kr.kochstil.stilid,
                    "kochstil": kr.kochstil.kochstil,
                    "beschreibung": kr.kochstil.beschreibung
                } for kr in r.kochstil
            ] if r.kochstil else []
        }
        for r in restaurants
    ]


# GET /api/restaurants/{id} - Get specific restaurant WITH menu AND address
@router.get("/{restaurantid}")
def get_restaurant(
        restaurantid: int,
        db: Session = Depends(get_db)
):
    service = RestaurantService(db)
    restaurant = service.get_by_id_with_menu(restaurantid)

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurantid} not found"
        )

    return {
        "restaurantid": restaurant.restaurantid,
        "name": restaurant.name,
        "klassifizierung": restaurant.klassifizierung,
        "adresseid": restaurant.adresseid,
        "telefon": restaurant.telefon,
        "kuechenchef": restaurant.kuechenchef,
        # Adresse
        "adresse": {
            "adresseid": restaurant.adresse.adresseid,
            "straße": restaurant.adresse.straße,
            "hausnummer": restaurant.adresse.hausnummer,
            "postleitzahl": restaurant.adresse.postleitzahl,
            "ort": restaurant.adresse.ort,
            "land": restaurant.adresse.land
        } if restaurant.adresse else None,

        "kochstile": [
            {
                "stilid": kr.kochstil.stilid,
                "kochstil": kr.kochstil.kochstil,
                "beschreibung": kr.kochstil.beschreibung
            } for kr in restaurant.kochstil
        ] if restaurant.kochstil else [],
        # Menüs mit Gerichten und Preisen
        "menue": [
            {
                "menuid": menu.menuid,
                "name": menu.name,
                "restaurantid": menu.restaurantid,
                "gericht": [
                    {
                        "gerichtid": gericht.gerichtid,
                        "menuid": gericht.menuid,
                        "name": gericht.name,
                        "beschreibung": gericht.beschreibung,
                        "kategorie": gericht.kategorie,
                        "preis": [
                            {
                                "preisid": preis.preisid,
                                "betrag": float(preis.betrag) if preis.betrag else 0.0,
                                "gerichtid": preis.gerichtid,
                                "gueltigvon": preis.gueltigvon.isoformat() if preis.gueltigvon else None,
                                "gueltigbis": preis.gueltigbis.isoformat() if preis.gueltigbis else None,
                                "preistyp": preis.preistyp,
                                "istaktiv": preis.istaktiv
                            } for preis in (gericht.preis if hasattr(gericht, 'preis') else [])
                        ]
                    } for gericht in (menu.gericht if hasattr(menu, 'gericht') else [])
                ]
            } for menu in (restaurant.menue if hasattr(restaurant, 'menue') else [])
        ]
    }


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
        restaurantid: int,
        restaurant_update: RestaurantUpdate,
        db: Session = Depends(get_db)
):
    service = RestaurantService(db)
    updated_restaurant = service.update(
        restaurantid,
        restaurant_update.model_dump(exclude_unset=True)
    )

    if not updated_restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurantid} not found"
        )

    return updated_restaurant

# DELETE /api/restaurants/{restaurant_id} - Delete restaurant
@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    service = RestaurantService(db)
    success = service.delete(restaurantid)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Restaurant with id {restaurantid} not found"
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
