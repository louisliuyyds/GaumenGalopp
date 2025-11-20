from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship


class KochstilRestaurant(Base):
    __tablename__ = 'kochstilrestaurant'

    stilid = Column(Integer, ForeignKey('kochstil.stilid'), primary_key=True)
    restaurantid = Column(Integer, ForeignKey('restaurant.restaurantid'), primary_key=True)

    kochstil = relationship("Kochstil", back_populates="restaurant")
    restaurant = relationship("Restaurant", back_populates="kochstil")

def to_dict(self):
    return {
        "stilid": self.stilid,
        "restaurantid": self.restaurantid
    }