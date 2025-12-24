from sqlalchemy.orm import Session
from models.labelGericht import LabelGericht
from typing import List, Optional

class LabelGerichtService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[type[LabelGericht]]:
        return self.db.query(LabelGericht).all()

    def get_by_label_id(self, label_id: int) -> List[type[LabelGericht]]:
        return self.db.query(LabelGericht).filter(LabelGericht.labelid == label_id).all()

    def get_by_gericht_id(self, gericht_id: int) -> List[type[LabelGericht]]:
        return self.db.query(LabelGericht).filter(LabelGericht.gerichtid == gericht_id).all()

    def create(self, label_data: dict) -> LabelGericht:
        new_label = LabelGericht(**label_data)
        self.db.add(new_label)
        self.db.commit()
        self.db.refresh(new_label)
        return new_label

    def delete(self, gerichtid: int, labelid: int) -> Optional[type[LabelGericht]]:
        label = self.db.query(LabelGericht).filter(LabelGericht.labelid == labelid & LabelGericht.gerichtid == gerichtid).first()
        self.db.delete(label)
        self.db.commit()