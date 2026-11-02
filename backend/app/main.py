from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BridgeFood API", version="0.1.0",
              description="Non-commercial Indian food discovery prototype")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RESTAURANTS = [
    {
        "id": 1, "name": "Masala Junction", "cuisine": "North Indian",
        "description": "Comforting curries, biryani and freshly baked breads.",
        "rating": 4.8, "delivery_minutes": "25–35 min", "delivery_fee": 1.49,
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900",
        "tags": ["Popular", "Vegetarian options"],
        "menu": [
            {"id": 101, "name": "Paneer Butter Masala", "description": "Paneer in a rich tomato and butter gravy.", "price": 10.95, "category": "Mains", "vegetarian": True},
            {"id": 102, "name": "Chicken Dum Biryani", "description": "Fragrant basmati rice layered with spiced chicken.", "price": 12.50, "category": "Biryani", "vegetarian": False},
            {"id": 103, "name": "Garlic Naan", "description": "Soft tandoor-baked bread with garlic.", "price": 3.25, "category": "Sides", "vegetarian": True}
        ]
    },
    {
        "id": 2, "name": "Dosa District", "cuisine": "South Indian",
        "description": "Crisp dosas, idli and homestyle South Indian favourites.",
        "rating": 4.7, "delivery_minutes": "20–30 min", "delivery_fee": 0.99,
        "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=900",
        "tags": ["South Indian", "Vegetarian"],
        "menu": [
            {"id": 201, "name": "Masala Dosa", "description": "Crisp dosa with potato masala, sambar and chutneys.", "price": 8.95, "category": "Dosa", "vegetarian": True},
            {"id": 202, "name": "Idli Sambar", "description": "Steamed rice cakes with lentil sambar.", "price": 6.50, "category": "Breakfast", "vegetarian": True},
            {"id": 203, "name": "Medu Vada", "description": "Savoury lentil doughnuts with coconut chutney.", "price": 5.95, "category": "Sides", "vegetarian": True}
        ]
    },
    {
        "id": 3, "name": "The Biryani House", "cuisine": "Indian",
        "description": "Aromatic dum biryani and classic street-food plates.",
        "rating": 4.6, "delivery_minutes": "30–40 min", "delivery_fee": 1.25,
        "image": "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900",
        "tags": ["Biryani", "Staff pick"],
        "menu": [
            {"id": 301, "name": "Hyderabadi Veg Biryani", "description": "Dum-cooked basmati rice with vegetables and herbs.", "price": 10.50, "category": "Biryani", "vegetarian": True},
            {"id": 302, "name": "Chicken 65", "description": "Crispy, spiced chicken bites.", "price": 7.95, "category": "Starters", "vegetarian": False},
            {"id": 303, "name": "Gulab Jamun", "description": "Soft milk dumplings in cardamom syrup.", "price": 4.25, "category": "Desserts", "vegetarian": True}
        ]
    }
]

@app.get("/api/health")
def health():
    return {"status": "ok", "mode": "prototype", "orders": "simulated"}

@app.get("/api/restaurants")
def list_restaurants():
    return RESTAURANTS

@app.get("/api/restaurants/{restaurant_id}")
def get_restaurant(restaurant_id: int):
    return next((r for r in RESTAURANTS if r["id"] == restaurant_id), None)

@app.post("/api/orders/simulate")
def simulate_order(payload: dict):
    # Deliberately in-memory and simulated: no payment or fulfilment.
    return {
        "order_id": "BF-DEMO-0001",
        "status": "SIMULATED",
        "message": "Demo order created. No restaurant was notified and no payment was taken.",
        "items": payload.get("items", []),
    }
