
import uuid

from datetime import datetime

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class StatusUpdate(Base):
    __tablename__ = "status_updates"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    content: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    media_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    storage_key: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    mime_type: Mapped[str | None] = mapped_column(
        String(127),
        nullable=True,
    )
    
    audience_mode: Mapped[str] = mapped_column(
    String(30),
    default="contacts",
    server_default="contacts",
    nullable=False,
    )

    size_bytes: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        CheckConstraint(
            "media_type IN ('text', 'image', 'video')",
            name="check_status_updates_media_type",
        ),
        CheckConstraint(
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
            name="check_status_updates_content",
        ),
        CheckConstraint(
            "expires_at > created_at",
            name="check_status_updates_expiry",
        ),
        CheckConstraint(
            "audience_mode IN ('contacts', 'contacts_except', 'only_share_with')",
            name="check_status_updates_audience_mode",
        ),
        Index(
            "ix_status_updates_user_created_at",
            "user_id",
            "created_at",
        ),
        Index(
            "ix_status_updates_expires_at",
            "expires_at",
        ),
    )
