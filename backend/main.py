from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers import restaurant_controller, menue_controller, bestellposition_controller, warenkorb_controller
from controllers import adresse_controller, oeffnungszeit_detail_controller, bestellung_controller
from controllers import restaurant_oeffnungszeit_controller
from controllers import bewertung_controller
from controllers import kunde_controller
from controllers import gericht_controller, kritiker_controller, kochstil_controller, kochstilrestaurant_controller
from controllers import label_controller, labelGericht_controller, lieferant_controller, preis_controller
from controllers import bewertungkritiker_controller, oeffnungszeit_vorlage_controller
from controllers import auth_controller


# Create FastAPI app
app = FastAPI(
    title="Food Delivery API",
    description="Backend API for food delivery application",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller.router)
app.include_router(menue_controller.router)
app.include_router(restaurant_controller.router)
app.include_router(adresse_controller.router)
app.include_router(oeffnungszeit_detail_controller.router)
app.include_router(bestellung_controller.router)
app.include_router(bestellposition_controller.router)
app.include_router(restaurant_oeffnungszeit_controller.router)
app.include_router(bewertung_controller.router)
app.include_router(kunde_controller.router)
app.include_router(gericht_controller.router)
app.include_router(kritiker_controller.router)
app.include_router(kochstil_controller.router)
app.include_router(kochstilrestaurant_controller.router)
app.include_router(label_controller.router)
app.include_router(labelGericht_controller.router)
app.include_router(lieferant_controller.router)
app.include_router(preis_controller.router)
app.include_router(bewertungkritiker_controller.router)
app.include_router(oeffnungszeit_vorlage_controller.router)
app.include_router(warenkorb_controller.router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Food Delivery API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}