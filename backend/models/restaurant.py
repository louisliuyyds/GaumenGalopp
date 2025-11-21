# models/restaurant.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Restaurant(Base):
    __tablename__ = 'restaurant'
    
    restaurantID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    klassifizierung = Column(String(100))
    adresseID = Column(Integer, ForeignKey('adresse.adresseID'))
    telefon = Column(String(20))
    kuechenchef = Column(String(255))
    
    # Relationships
    adresse = relationship("Adresse", back_populates="restaurants")
    menue = relationship("Menue", back_populates="restaurant", uselist=False)
    bestellungen = relationship("Bestellung", back_populates="restaurant")
    kochstile = relationship("KochstilRestaurant", back_populates="restaurant")
    oeffnungszeiten = relationship("RestaurantOeffnungszeit", back_populates="restaurant")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "restaurantID": self.restaurantID,
            "name": self.name,
            "klassifizierung": self.klassifizierung,
            "adresseID": self.adresseID,
            "telefon": self.telefon,
            "kuechenchef": self.kuechenchef
        }