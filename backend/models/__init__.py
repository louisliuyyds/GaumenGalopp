# models/__init__.py
"""
Restaurant Management System - SQLAlchemy Models
All database models for the restaurant ordering and delivery system.
"""

from ..database import Base, engine

# Import all models
from adresse import Adresse
from kunde import Kunde
from restaurant import Restaurant
from menue import Menue
from gericht import Gericht
from bestellungen import Bestellungen
from bestellposition import Bestellposition
from lieferant import Lieferant
from preis import Preis
from bewertung import Bewertung
from kritiker import Kritiker
from bewertungkritiker import Bewertungkritiker
from label import Label
from labelGericht import LabelGericht
from kochstil import Kochstil
from kochstilrestaurant import KochstilRestaurant
from oeffnungszeit_vorlage import OeffnungszeitVorlage
from oeffnungszeit_detail import OeffnungszeitDetail
from restaurant_oeffnungszeit import RestaurantOeffnungszeit


# Export all models
__all__ = [
    'Adresse',
    'Kunde',
    'Restaurant',
    'Menue',
    'Gericht',
    'Bestellungen',
    'Bestellposition',
    'Lieferant',
    'Preis',
    'Bewertung',
    'Kritiker',
    'Bewertungkritiker',
    'Label',
    'LabelGericht',
    'Kochstil',
    'KochstilRestaurant',
    'OeffnungszeitVorlage',
    'OeffnungszeitDetail',
    'RestaurantOeffnungszeit'
]


def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Drop all tables from the database"""
    Base.metadata.drop_all(bind=engine)