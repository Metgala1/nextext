
"""add status audience controls

Revision ID: 739bddee527b
Revises: a15f7aa969d7
Create Date: 2026-11-26 17:44:17.058612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '739bddee527b'
down_revision: Union[str, Sequence[str], None] = 'a15f7aa969d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        'status_audiences',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('status_id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ['status_id'],
            ['status_updates.id'],
            ondelete='CASCADE',
        ),
        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
            ondelete='CASCADE',
        ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint(
            'status_id',
            'user_id',
            name='uq_status_audiences_status_user',
        ),
    )

    op.create_index(
        'ix_status_audiences_user_id',
        'status_audiences',
        ['user_id'],
        unique=False,
    )

    op.add_column(
        'status_updates',
        sa.Column(
            'audience_mode',
            sa.String(length=30),
            server_default='contacts',
            nullable=False,
        ),
    )

    op.create_check_constraint(
        'check_status_updates_audience_mode',
        'status_updates',
        "audience_mode IN ('contacts', 'contacts_except', 'only_share_with')",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        'check_status_updates_audience_mode',
        'status_updates',
        type_='check',
    )

    op.drop_column('status_updates', 'audience_mode')

    op.drop_index(
        'ix_status_audiences_user_id',
        table_name='status_audiences',
    )

    op.drop_table('status_audiences')
