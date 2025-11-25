from database import Base
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Bewertung(Base):
    __tablename__ = "bewertung"
    bewertungid = Column(Integer, primary_key=True, index=True)
    kundenid = Column(Integer, ForeignKey('kunde.kundenid'), nullable=False)
    gerichtid = Column(Integer, ForeignKey('gericht.gerichtid'), nullable=False)
    rating = Column(Integer)
    kommentar = Column(String(500))
    erstelltam = Column(Date)

    gericht = relationship("Gericht", back_populates="bewertung")
    kunde = relationship("Kunde", back_populates="bewertungen")

    def to_dict(self):
        return {
            "bewertungid": self.bewertungid,
            "kundenid": self.kundenid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,          
            "kommentar": self.kommentar,
            "erstelltam": self.erstelltam,
        }