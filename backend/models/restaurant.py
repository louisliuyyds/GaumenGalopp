from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Restaurant(Base):
    __tablename__ = 'restaurant'
    
    restaurantid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    klassifizierung = Column(String(100))
    adresseid = Column(Integer, ForeignKey('adresse.adresseid'))
    telefon = Column(String(20))
    kuechenchef = Column(String(255))
    email = Column(String(255), nullable=False, unique=True)
    passwordhash = Column(Text, nullable=False)
    
    # Relationships
    adresse = relationship("Adresse", back_populates="restaurant")
    menue = relationship("Menue", back_populates="restaurant", uselist=False)
    bestellungen = relationship("Bestellungen", back_populates="restaurant")
    kochstil = relationship("KochstilRestaurant", back_populates="restaurant")
    oeffnungszeiten = relationship("RestaurantOeffnungszeit", back_populates="restaurant")
    
    def to_dict(self):
        return {
            "restaurantid": self.restaurantid,
            "name": self.name,
            "klassifizierung": self.klassifizierung,
            "adresseid": self.adresseid,
            "telefon": self.telefon,
            "kuechenchef": self.kuechenchef,
            "email": self.email
        }