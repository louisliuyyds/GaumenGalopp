from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base

class Preis(Base):
    __tablename__ = 'preis'
    preisid = Column(Integer, primary_key=True, autoincrement=True)
    gerichtid = Column(Integer, ForeignKey('gericht.gerichtid'))
    betrag = Column(Numeric(10,2))
    gueltigvon = Column(DateTime)
    gueltigbis = Column(DateTime)
    preistyp = Column(String(50))
    istaktiv = Column(Boolean)

    gericht = relationship("Gericht", back_populates="preis")

    def to_dict(self):
        return {
            "preisid": self.preisid,
            "gericht": self.gericht.to_dict() if self.gericht else None,
            "betrag": float(self.betrag) if self.betrag else None,
            "gueltigvon": self.gueltigvon.isoformat() if self.gueltigvon else None,
            "gueltigbis": self.gueltigbis.isoformat() if self.gueltigbis else None,
            "preistyp": self.preistyp,
            "istaktiv": self.istaktiv
        }
