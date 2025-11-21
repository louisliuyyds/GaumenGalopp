# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from GaumenGalopp.backend.database import Base 
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey
from sqlalchemy.orm._orm_constructors import relationship

class Bewertungkritiker(Base):
    __tablename__ = "bewertungkritiker"

    bewertungkritikerid = Column("bewertungkritikerid", Integer, primary_key=True, index=True)
    kritikerid = Column("kritikerid", Integer, ForeignKey("KRITIKER.kritikerid"))
    kritiker = relationship("Kritiker", back_populates="bewertungkritiker")
    gerichtid = Column("gerichtid", Integer, ForeignKey("GERICHT.gerichtID"))
    gericht = relationship("Gericht", back_populates="bewertungkritiker")
    rating = Column("rating", SmallInteger)

    def to_dict(self):
        return {
            "bewertungkritikerid": self.bewertungkritikerid,
            "kritikerid": self.kritikerid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,
        }