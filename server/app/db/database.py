from sqlalchemy import create_engine
from app.core.config import settings

# Handle SQLite vs PostgreSQL connect args and connection pooling
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# SQLAlchemy 2.x Engine with Connection Pooling
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
) if not settings.DATABASE_URL.startswith("sqlite") else create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)
