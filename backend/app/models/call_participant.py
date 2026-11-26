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


class CallParticipant(Base):
    __tablename__ = "call_participants"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    call_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("calls.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="invited",
        server_default="invited",
        nullable=False,
    )

    joined_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    left_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "call_id",
            "user_id",
            name="uq_call_participants_call_user",
        ),
        CheckConstraint(
            "status IN ('invited', 'ringing', 'joined', 'left', 'declined', 'missed')",
            name="check_call_participants_status",
        ),
        CheckConstraint(
            "left_at IS NULL OR joined_at IS NOT NULL",
            name="check_call_participants_left_requires_join",
        ),
        CheckConstraint(
            "left_at IS NULL OR left_at >= joined_at",
            name="check_call_participants_valid_duration",
        ),
        Index(
            "ix_call_participants_user_id",
            "user_id",
        ),
    )