"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-15 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Tables are auto-created by SQLAlchemy Base.metadata.create_all
    pass

def downgrade():
    pass
