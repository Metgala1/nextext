import uuid

from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Call(Base):
    __tablename__ = "calls"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
    )

    initiator_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    call_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="ringing",
        server_default="ringing",
        nullable=False,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "call_type IN ('audio', 'video')",
            name="check_calls_call_type",
        ),
        CheckConstraint(
            "status IN ('ringing', 'ongoing', 'ended', 'missed', 'rejected', 'cancelled')",
            name="check_calls_status",
        ),
        CheckConstraint(
            "ended_at IS NULL OR started_at IS NOT NULL",
            name="check_calls_end_requires_start",
        ),
        CheckConstraint(
            "ended_at IS NULL OR ended_at >= started_at",
            name="check_calls_valid_duration",
        ),
        Index(
            "ix_calls_conversation_id",
            "conversation_id",
        ),
        Index(
            "ix_calls_initiator_id",
            "initiator_id",
        ),
        Index(
            "ix_calls_created_at",
            "created_at",
        ),
    )