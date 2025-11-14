# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from .database import Base 
from sqlalchemy import Column, Integer, String, Date, ForeignKey

# Diese Definition basiert exakt auf 2_Datenmodell [cite: 149-158]
class Kritiker(Base):
    __tablename__ = "KRITIKER"

    kritikerid = Column("kritikerid", Integer, primary_key=True, index=True)
    kundenid = Column("kundenid", Integer, ForeignKey("KUNDE.kundenID"))
    beschreibung = Column("beschreibung", String(100))
    kritikername = Column("kritikername", String(50))

    def to_dict(self):
        return {
            "kritikerid": self.kritikerid,
            "kundenid": self.kundenid,
            "beschreibung": self.beschreibung,
            "kritikername": self.kritikername,            
        }