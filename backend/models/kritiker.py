# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from sqlalchemy.orm._orm_constructors import relationship
from GaumenGalopp.backend.database import Base 
from sqlalchemy import Column, Integer, String, Date, ForeignKey

class Kritiker(Base):
    __tablename__ = "KRITIKER"

    kritikerid = Column("kritikerid", Integer, primary_key=True, index=True)
    kundenid = Column("kundenid", Integer, ForeignKey("KUNDE.kundenID"))
    kunde = relationship("Kunde", back_populates="kritiker") 
    beschreibung = Column("beschreibung", String(100))
    kritikername = Column("kritikername", String(50))

    def to_dict(self):
        return {
            "kritikerid": self.kritikerid,
            "kundenid": self.kundenid,
            "beschreibung": self.beschreibung,
            "kritikername": self.kritikername,            
        }