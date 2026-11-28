from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session import Session
from datetime import datetime, timezone


class SessionRepository:

    @staticmethod
    async def get_unrevoked_by_user_id(
        db: AsyncSession,
        user_id: UUID,
    ) -> Session | None:
        result = await db.execute(
            select(Session).where(
                Session.user_id == user_id,
                Session.revoked_at.is_(None),
            )
        )

        return result.scalar_one_or_none()
    
    @staticmethod
    async def revoke(
        db: AsyncSession,
        session: Session,
    ) -> None:
        session.revoked_at = datetime.now(timezone.utc)

        await db.flush()