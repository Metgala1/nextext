
import uuid

from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class StatusView(Base):
    __tablename__ = "status_views"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    status_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "status_updates.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    viewer_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    viewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "status_id",
            "viewer_id",
            name="uq_status_views_status_viewer",
        ),
        Index(
            "ix_status_views_viewer_id",
            "viewer_id",
        ),
    )
