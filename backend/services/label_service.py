from sqlalchemy.orm import Session
from ..models.label import Label
from typing import List, Optional

class LabelService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[type[Label]]:
        return self.db.query(Label).all()

    def get_by_id(self, label_id: int) -> Optional[Label]:
        return self.db.query(Label).filter(Label.labelid == label_id).first()

    def get_by_id_list(self, id_list: list[type[int]]) -> list[type[Label]]:
        return self.db.query(Label).filter(Label.labelid.in_(id_list)).all()

    def create(self, label_data: dict) -> Label:
        new_label = Label(**label_data)
        self.db.add(new_label)
        self.db.commit()
        self.db.refresh(new_label)
        return new_label

    def update(self, labelid: int, update_data: dict) -> Optional[Label]:
        label = self.get_by_id(labelid)
        if not label:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(label, key, value)

        self.db.commit()
        self.db.refresh(label)
        return label

    def delete(self, labelid: int) -> Optional[Label]:
        label = self.get_by_id(labelid)
        if not label:
            return None
        self.db.delete(label)
        self.db.commit()
        self.db.refresh(label)
        return label