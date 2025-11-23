from sqlalchemy.orm import Session
from backend.models.menue import Menue
from typing import Optional

class MenueService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[Menue]]:
        return self.db.query(Menue).all()

    def get_by_id(self, menueid: int) -> Optional[Menue]:
        return self.db.query(Menue).filter(Menue.menueid == menueid).first()

    def create(self, menue_data: dict) -> Menue:
        new_menue = Menue(**menue_data)
        self.db.add(new_menue)
        self.db.commit()
        self.db.refresh(new_menue)
        return new_menue

    def update(self, menueid: int, update_data: dict) -> Optional[Menue]:
        menue = self.get_by_id(menueid)
        if not menue:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(menue, key, value)

        self.db.commit()
        self.db.refresh(menue)
        return menue

    def delete(self, menueid: int) -> Optional[Menue]:
        menue = self.get_by_id(menueid)
        if not menue:
            return None
        self.db.delete(menue)
        self.db.commit()
        self.db.refresh(menue)
        return menue