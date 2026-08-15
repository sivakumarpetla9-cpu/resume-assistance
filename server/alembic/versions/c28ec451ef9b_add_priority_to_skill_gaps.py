"""Add priority to skill gaps

Revision ID: c28ec451ef9b
Revises: b19dc377da3a
Create Date: 2026-08-16 01:36:00.000000+00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c28ec451ef9b'
down_revision: Union[str, Sequence[str], None] = 'b19dc377da3a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('skill_gaps', sa.Column('priority', sa.String(), nullable=True, server_default='HIGH'))

def downgrade() -> None:
    op.drop_column('skill_gaps', 'priority')
