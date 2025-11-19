# Importieren Sie 'Base' aus Ihrer database.py
# (Sie müssen 'Base = declarative_base()' in database.py aktivieren)
from GaumenGalopp.backend.database import Base 
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey, DateTime
from sqlalchemy.orm._orm_constructors import relationship

# Diese Definition basiert exakt auf 2_Datenmodell 
class Bewertung(Base):
    __tablename__ = "BEWERTUNG"

    bewertungid = Column("bewertungid", Integer, primary_key=True, index=True)
    kundenid = Column("kundenid", Integer, ForeignKey("KUNDE.kundenID"))
    kunde = relationship("Kunde", back_populates="bewertung")
    gerichtid = Column("gerichtid", Integer, ForeignKey("GERICHT.gerichtID"))
    gericht = relationship("Gericht", back_populates="bewertung")
    rating = Column("rating", Integer)
    kommentar = Column("kommentar", String(500))
    erstelltam = Column("erstelltam", Date)

    def to_dict(self):
        return {
            "bewertungid": self.bewertungid,
            "kundenid": self.kundenid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,          
            "kommentar": self.kommentar,
            "erstelltam": self.erstelltam,
        }