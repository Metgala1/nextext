from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.phone_verification import PhoneVerification


class PhoneVerificationRepository:

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        verification_id: UUID,
    ) -> PhoneVerification | None:
        result = await db.execute(
            select(PhoneVerification).where(
                PhoneVerification.id == verification_id
            )
        )

        return result.scalar_one_or_none()

    
    @staticmethod
    async def get_latest_pending(
        db: AsyncSession,
        phone_number: str,
        purpose: str,
    ) -> PhoneVerification | None:
        result = await db.execute(
            select(PhoneVerification)
            .where(
                PhoneVerification.phone_number == phone_number,
                PhoneVerification.purpose == purpose,
                PhoneVerification.consumed_at.is_(None),
                PhoneVerification.invalidated_at.is_(None),
            )
            .order_by(PhoneVerification.created_at.desc())
            .limit(1)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        *,
        phone_number: str,
        code_hash: str,
        purpose: str,
        expires_at: datetime,
    ) -> PhoneVerification:
        verification = PhoneVerification(
            phone_number=phone_number,
            code_hash=code_hash,
            purpose=purpose,
            expires_at=expires_at,
        )

        db.add(verification)
        await db.flush()

        return verification
    
    @staticmethod
    async def invalidate(
        db: AsyncSession,
        verification: PhoneVerification,
    ) -> None:
        verification.invalidated_at = datetime.now(timezone.utc)

        await db.flush()
        
    @staticmethod
    async def increment_attempts(
        db: AsyncSession,
        verification_id: UUID,
    ) -> int:
        result = await db.execute(
            update(PhoneVerification)
            .where(
                PhoneVerification.id == verification_id,
            )
            .values(
                attempts=PhoneVerification.attempts + 1,
            )
            .returning(PhoneVerification.attempts)
        )

        return result.scalar_one()
    
    @staticmethod
    async def consume(
        db: AsyncSession,
        verification: PhoneVerification,
    ) -> None:
        verification.consumed_at = datetime.now(timezone.utc)

        await db.flush()
        
    @staticmethod
    async def invalidate_pending(
        db: AsyncSession,
        phone_number: str,
        purpose: str,
    ) -> int:
        result = await db.execute(
            update(PhoneVerification)
            .where(
                PhoneVerification.phone_number == phone_number,
                PhoneVerification.purpose == purpose,
                PhoneVerification.consumed_at.is_(None),
                PhoneVerification.invalidated_at.is_(None),
            )
            .values(
                invalidated_at=datetime.now(timezone.utc),
            )
        )

        return result.rowcount
    
    @staticmethod
    async def get_by_id_for_update(
        db: AsyncSession,
        verification_id: UUID,
    ) -> PhoneVerification | None:
        result = await db.execute(
            select(PhoneVerification)
            .where(PhoneVerification.id == verification_id)
            .with_for_update()
        )

        return result.scalar_one_or_none()