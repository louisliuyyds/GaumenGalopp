from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Kochstil(Base):
    __tablename__ = 'kochstil'

    stilid = Column(Integer, primary_key=True, autoincrement=True)
    kochstil = Column(String(100), nullable=False)
    beschreibung = Column(String(255))

    restaurant = relationship("KochstilRestaurant", back_populates="kochstil")

    def to_dict(self):
        return {
            "stilid": self.stilid,
            "kochstil": self.kochstil,
            "beschreibung": self.beschreibung
        }