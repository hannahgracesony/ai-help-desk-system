from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.database import engine, Base
# Import models BEFORE create_all so SQLAlchemy knows about the tables
from app import models

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Help Desk API",
    description="API for the AI-powered ticket management MVP",
    version="1.0.0"
)

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Help Desk API"}

# Include routers
from app.routes import users, tickets, ai, auth
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tickets.router)
app.include_router(ai.router)
