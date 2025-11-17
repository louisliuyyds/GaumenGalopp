# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)

from sqlalchemy.orm._orm_constructors import relationship
from GaumenGalopp.backend.database import Base 
from sqlalchemy import Column, Integer, String, Date, ForeignKey

# Diese Definition basiert exakt auf 2_Datenmodell [cite: 149-158]
class Kunde(Base):
    __tablename__ = "KUNDE"

    kundenID = Column("kundenid", Integer, primary_key=True, index=True)
    vorname = Column("vorname", String(50))
    nachname = Column("nachname", String(50))
    adresseID = Column("adresseid", Integer, ForeignKey("ADRESSE.adresseID"))
    adresse = relationship("Adresse", back_populates="kunden") 
    geburtsdatum = Column("geburtsdatum", Date)
    telefonnummer = Column("telefonnummer", String(20))
    email = Column("email", String(255))
    namenskuerzel = Column("namenskuerzel", String(100)) # Wichtig für Business Rule [cite: 338]

    def to_dict(self):
        return {
            "kundenID": self.kundenID,
            "vorname": self.vorname,
            "nachname": self.nachname,
            "adressID": self.adressID,
            "geburtsdatum": self.geburtsdatum,
            "telefonnummer": self.telefonnummer,
            "email": self.email,
            "namenskuerzel": self.namenskuerzel,
        }