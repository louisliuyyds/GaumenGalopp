# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from .database import Base 
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey

from GaumenGalopp.backend.models import kritiker

# Diese Definition basiert exakt auf 2_Datenmodell [cite: 149-158]
class Bewertunkritike(Base):
    __tablename__ = "bewertunkritike"

    bewertunkritikeid = Column("bewertunkritikeid", Integer, primary_key=True, index=True)
    kritikerid = Column("kritikerid", Integer, ForeignKey("KRITIKER.kritikerid"))
    gerichtid = Column("gerichtid", Integer, ForeignKey("GERICHT.gerichtID"))
    rating = Column("rating", SmallInteger)

    def to_dict(self):
        return {
            "bewertunkritikeid": self.bewertunkritikeid,
            "kritikerid": self.kritikerid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,
        }