# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from GaumenGalopp.backend.database import Base 
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey
from sqlalchemy.orm._orm_constructors import relationship


class Adresse(Base):
    __tablename__ = "adresse"

    adresseid = Column("adresseid", Integer, primary_key=True, index=True)
    straße = Column("strasse", String(100))
    land = Column("land", String(50))
    ort = Column("ort", String(50))
    hausnummer = Column("hausnummer", String(10))
    postleitzahl = Column("postleitzahl", String(10))

    def to_dict(self):
        return {
            "adresseid": self.adresseid,
            "straße": self.straße,
            "land": self.land,
            "ort": self.ort,
            "hausnummer": self.hausnummer,
            "postleitzahl": self.postleitzahl,
        }