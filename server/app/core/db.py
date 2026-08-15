from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings


database_url = settings.DATABASE_URL

# Use psycopg 3 with PostgreSQL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1
    )


# SQLite configuration
if database_url.startswith("sqlite"):
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )

# PostgreSQL configuration
else:
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=20,
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()