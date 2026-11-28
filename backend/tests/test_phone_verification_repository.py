
import asyncio
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.db.database import AsyncSessionLocal
from app.repositories.phone_verification_repository import (
    PhoneVerificationRepository,
)


async def main():
    phone_number = "+237699999999"
    purpose = "registration"

    async with AsyncSessionLocal() as db:
        # The transaction rolls back automatically after the test.
        async with db.begin():

            # 1. Create a verification record.
            verification = await PhoneVerificationRepository.create(
                db,
                phone_number=phone_number,
                code_hash="a" * 64,
                purpose=purpose,
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
            )

            assert verification.id is not None
            assert verification.attempts == 0

            # 2. Retrieve it by ID.
            found = await PhoneVerificationRepository.get_by_id(
                db,
                verification.id,
            )

            assert found is not None
            assert found.id == verification.id

            # 3. Find the latest pending verification.
            latest = await PhoneVerificationRepository.get_latest_pending(
                db,
                phone_number,
                purpose,
            )

            assert latest is not None
            assert latest.id == verification.id

            # 4. Increment failed attempts.
            attempts = await PhoneVerificationRepository.increment_attempts(
                db,
                verification.id,
            )

            assert attempts == 1

            # 5. Consume the verification.
            await PhoneVerificationRepository.consume(db, verification)
            await db.refresh(
                verification,
                attribute_names=["consumed_at"],
            )

            assert verification.consumed_at is not None

            # A consumed verification should no longer be pending.
            latest = await PhoneVerificationRepository.get_latest_pending(
                db,
                phone_number,
                purpose,
            )

            assert latest is None

            # 6. Create two more pending verifications.
            first = await PhoneVerificationRepository.create(
                db,
                phone_number=phone_number,
                code_hash="b" * 64,
                purpose=purpose,
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
            )

            second = await PhoneVerificationRepository.create(
                db,
                phone_number=phone_number,
                code_hash="c" * 64,
                purpose=purpose,
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
            )

            # 7. Invalidate all pending verifications.
            invalidated_count = (
                await PhoneVerificationRepository.invalidate_pending(
                    db,
                    phone_number,
                    purpose,
                )
            )

            assert invalidated_count == 2

            await db.refresh(first, attribute_names=["invalidated_at"])
            await db.refresh(second, attribute_names=["invalidated_at"])

            assert first.invalidated_at is not None
            assert second.invalidated_at is not None

            # 8. No pending verification should remain.
            latest = await PhoneVerificationRepository.get_latest_pending(
                db,
                phone_number,
                purpose,
            )

            assert latest is None

            # 9. Test individual invalidation.
            another = await PhoneVerificationRepository.create(
                db,
                phone_number=phone_number,
                code_hash="d" * 64,
                purpose=purpose,
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
            )

            await PhoneVerificationRepository.invalidate(db, another)

            await db.refresh(another, attribute_names=["invalidated_at"])
            assert another.invalidated_at is not None

    print("PhoneVerificationRepository tests passed!")


if __name__ == "__main__":
    asyncio.run(main())
