from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ...backend.database import Base

class Restaurant(Base):
    __tablename__ = 'restaurant'
    restaurantid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    klassifizierung = Column(String(100))
    adressid = Column(Integer, ForeignKey('adresse.adresseid'))
    telefon = Column(String(100))
    kuechenchef = Column(String(100))

    adresse = relationship("Adresse", back_populates="restaurant")

    def to_dict(self):
        return {
            "restaurantid": self.restaurantid,
            "name": self.name,
            "klassifizierung": self.klassifizierung,
            "telefon": self.telefon,
            "kuechenchef": self.kuechenchef,
            "adresse": self.adresse.to_dict() if self.adresse else None
        }
