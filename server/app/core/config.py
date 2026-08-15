import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "STITCH - AI Career Intelligence"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "stitch-secret-key-super-secure-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database URL: Defaults to local SQLite for seamless zero-config setup, supports PostgreSQL in prod
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./stitch.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Environment Mode
    APP_ENV: str = os.getenv("APP_ENV", "development") # "production" or "development"
    
    # AI Credentials
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "development") # "openai" or "development"

    class Config:
        case_sensitive = True

settings = Settings()
