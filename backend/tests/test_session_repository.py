
import asyncio
import uuid

from datetime import datetime, timedelta, timezone

from app.db.database import AsyncSessionLocal
from app.models.session import Session
from app.repositories.session_repository import SessionRepository


async def main():
    # Use an existing user from your database.
    user_id = uuid.UUID("77556a7d-7153-4ceb-83ae-5a9d8bf5aa98")

    async with AsyncSessionLocal() as db:
        async with db.begin():
            test_session = Session(
                user_id=user_id,
                token_hash=uuid.uuid4().hex + uuid.uuid4().hex,
                expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            )

            db.add(test_session)
            await db.flush()

            # Test retrieval.
            found = await SessionRepository.get_unrevoked_by_user_id(
                db,
                user_id,
            )

            assert found is not None
            assert found.id == test_session.id
            assert found.revoked_at is None

            # Test revocation.
            await SessionRepository.revoke(db, found)

            # Refresh explicitly so SQLAlchemy does not attempt
            # implicit database I/O when reading the attribute.
            await db.refresh(found, attribute_names=["revoked_at"])

            assert found.revoked_at is not None

            # Verify it is no longer returned as unrevoked.
            result = await SessionRepository.get_unrevoked_by_user_id(
                db,
                user_id,
            )

            assert result is None

            # Remove the temporary session.
            await db.delete(test_session)
            await db.flush()

    print("SessionRepository tests passed!")


if __name__ == "__main__":
    asyncio.run(main())
