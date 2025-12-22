from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Kunde(Base):
    __tablename__ = 'kunde'

    kundenid = Column(Integer, primary_key=True, autoincrement=True)
    vorname = Column(String(50), nullable=False)
    nachname = Column(String(50), nullable=False)
    adressid = Column(Integer, ForeignKey('adresse.adresseid'), nullable=False) #Foreign key
    geburtsdatum = Column(Date)
    telefonnummer = Column(String(20))
    email = Column(String(255), nullable=False, unique=True)
    namenskuerzel = Column(String(100))
    passwordhash = Column(Text, nullable=False)

    # Auth-Felder
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)

    adresse = relationship("Adresse", back_populates="kunden")
    kritiker = relationship("Kritiker", back_populates="kunde")
    bestellungen = relationship("Bestellungen", back_populates="kunde")
    bewertungen = relationship("Bewertung", back_populates="kunde")


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