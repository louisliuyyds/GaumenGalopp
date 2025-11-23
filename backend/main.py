from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controllers import menue_controller, restaurant_controller

# Import controllers
# e.g. from controllers import restaurant_controller

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

app.include_router(menue_controller.router)
app.include_router(restaurant_controller.router)

# Register routers
# e.g. app.include_router(restaurant_controller.router)

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

# Run with: uvicorn main:app --reload