"""add canonical direct conversation participants

Revision ID: 54a4609353aa
Revises: 729c64f3da65
Create Date: 2026-11-26 16:03:17.812518

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '54a4609353aa'
down_revision: Union[str, Sequence[str], None] = '729c64f3da65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    op.add_column(
        "conversations",
        sa.Column("user_low_id", sa.Uuid(), nullable=True),
    )
    op.add_column(
        "conversations",
        sa.Column("user_high_id", sa.Uuid(), nullable=True),
    )

    op.create_foreign_key(
        "fk_conversations_user_low_id_users",
        "conversations",
        "users",
        ["user_low_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "fk_conversations_user_high_id_users",
        "conversations",
        "users",
        ["user_high_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_unique_constraint(
        "uq_conversations_direct_pair",
        "conversations",
        ["user_low_id", "user_high_id"],
    )

    op.create_check_constraint(
        "check_conversations_participants",
        "conversations",
        """
        (
            type = 'direct'
            AND user_low_id IS NOT NULL
            AND user_high_id IS NOT NULL
            AND user_low_id < user_high_id
        )
        OR
        (
            type = 'group'
            AND user_low_id IS NULL
            AND user_high_id IS NULL
        )
        """,
    )


def downgrade() -> None:
    op.drop_constraint(
        "check_conversations_participants",
        "conversations",
        type_="check",
    )

    op.drop_constraint(
        "uq_conversations_direct_pair",
        "conversations",
        type_="unique",
    )

    op.drop_constraint(
        "fk_conversations_user_high_id_users",
        "conversations",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_conversations_user_low_id_users",
        "conversations",
        type_="foreignkey",
    )

    op.drop_column("conversations", "user_high_id")
    op.drop_column("conversations", "user_low_id")
