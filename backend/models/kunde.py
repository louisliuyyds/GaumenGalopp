# models/restaurant.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime



class Kunde(Base):
    __tablename__ = 'kunde'

    kundenid = Column(Integer, primary_key=True, autoincrement=True)
    vorname = Column(String(50), nullable=False)
    nachname = Column(String(50), nullable=False)
    adressid = Column(Integer, ForeignKey('adresse.adresseid'), nullable=False) #Foreign key
    geburtsdatum = Column(Date)
    telefonnummer = Column(String(20))
    email = Column(String(255))
    namenskuerzel = Column(String(100))

    adresse = relationship("adresse", back_populates="kunden")


    def to_dict(self):
        return {
            "kundenid": self.kundenid,
            "vorname": self.vorname,
            "nachname": self.nachname,
            "adressid": self.adressid,
            "geburtsdatum": self.geburtsdatum,
            "telefonnummer": self.telefonnummer,
            "email": self.email,
            "namenskuerzel": self.namenskuerzel
        }