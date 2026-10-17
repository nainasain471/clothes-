import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key-change-me-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # SQLite file -> backend/instance/zelia.db
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///zelia.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ADMIN_EMAIL = (os.getenv("ADMIN_EMAIL") or "").strip().lower()
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD") or ""