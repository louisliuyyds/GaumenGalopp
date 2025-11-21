from fastapi import APIRouter
from ..services.gericht_service import GerichtService


router = APIRouter()


@router.get("/gericht/", tags=["users"])
async def read_users():
    return GerichtService().get_all()


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}