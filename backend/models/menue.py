from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Menue(Base):
    __tablename__ = 'menue'
    menuid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    restaurantid = Column(Integer, ForeignKey('restaurant.restaurantid'))

    restaurant = relationship("Restaurant", back_populates="menue")
    gericht = relationship("Gericht", back_populates="menue")

    def to_dict(self):
        return {
            "menuid": self.menuid,
            "name": self.name,
            "restaurant": self.restaurant.to_dict() if self.restaurant else None
        }
