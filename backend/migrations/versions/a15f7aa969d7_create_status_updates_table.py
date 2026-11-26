
"""create status updates table

Revision ID: a15f7aa969d7
Revises: bf5eb6b542c7
Create Date: 2026-11-26 17:24:23.601910

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a15f7aa969d7'
down_revision: Union[str, Sequence[str], None] = 'bf5eb6b542c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        'status_updates',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('media_type', sa.String(length=20), nullable=False),
        sa.Column('storage_key', sa.String(length=512), nullable=True),
        sa.Column('mime_type', sa.String(length=127), nullable=True),
        sa.Column('size_bytes', sa.BigInteger(), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),

        sa.CheckConstraint(
            """
            (
                media_type = 'text'
                AND content IS NOT NULL
                AND length(trim(content)) > 0
                AND storage_key IS NULL
                AND mime_type IS NULL
                AND size_bytes IS NULL
            )
            OR
            (
                media_type IN ('image', 'video')
                AND storage_key IS NOT NULL
                AND mime_type IS NOT NULL
                AND size_bytes IS NOT NULL
                AND size_bytes > 0
            )
            """,
            name='check_status_updates_content',
        ),

        sa.CheckConstraint(
            "media_type IN ('text', 'image', 'video')",
            name='check_status_updates_media_type',
        ),

        sa.CheckConstraint(
            'expires_at > created_at',
            name='check_status_updates_expiry',
        ),

        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
            ondelete='CASCADE',
        ),

        sa.PrimaryKeyConstraint('id'),
    )

    op.create_index(
        'ix_status_updates_expires_at',
        'status_updates',
        ['expires_at'],
        unique=False,
    )

    op.create_index(
        'ix_status_updates_user_created_at',
        'status_updates',
        ['user_id', 'created_at'],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        'ix_status_updates_user_created_at',
        table_name='status_updates',
    )

    op.drop_index(
        'ix_status_updates_expires_at',
        table_name='status_updates',
    )

    op.drop_table('status_updates')
