
import uuid

from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    title: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    created_by_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user_low_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
            name="fk_conversations_user_low_id_users",
        ),
        nullable=True,
    )

    user_high_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
            name="fk_conversations_user_high_id_users",
        ),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "ix_conversations_created_by_id",
            "created_by_id",
        ),
        CheckConstraint(
            "type IN ('direct', 'group')",
            name="check_conversations_type",
        ),
        UniqueConstraint(
            "user_low_id",
            "user_high_id",
            name="uq_conversations_direct_pair",
        ),
        CheckConstraint(
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
            name="check_conversations_participants",
        ),
    )
