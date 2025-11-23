from ..database import Base
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Bewertung(Base):
    __tablename__ = "BEWERTUNG"

    bewertungid = Column("bewertungid", Integer, primary_key=True, index=True)
    kundenid = Column("kundenid", Integer, ForeignKey("KUNDE.kundenID"))
    gerichtid = Column("gerichtid", Integer, ForeignKey("GERICHT.gerichtID"))
    rating = Column("rating", Integer)
    kommentar = Column("kommentar", String(500))
    erstelltam = Column("erstelltam", Date)

    gericht = relationship("Gericht", back_populates="bewertung")
    kunde = relationship("Kunde", back_populates="bewertung")

    def to_dict(self):
        return {
            "bewertungid": self.bewertungid,
            "kundenid": self.kundenid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,          
            "kommentar": self.kommentar,
            "erstelltam": self.erstelltam,
        }