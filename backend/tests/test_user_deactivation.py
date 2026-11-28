
import asyncio
import uuid

from datetime import datetime, timedelta, timezone

from app.db.database import AsyncSessionLocal
from app.models.session import Session
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService


async def main():
    user_id = uuid.UUID("77556a7d-7153-4ceb-83ae-5a9d8bf5aa98")

    async with AsyncSessionLocal() as db:
        # The transaction rolls back after the test, preserving
        # the user's original database state.
        async with db.begin():
            user = await UserRepository.get_by_id(db, user_id)
            assert user is not None

            test_session = Session(
                user_id=user_id,
                token_hash=uuid.uuid4().hex + uuid.uuid4().hex,
                expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            )

            db.add(test_session)
            await db.flush()

            # Run the complete service workflow.
            deactivated_user = await UserService.deactivate_user(db, user_id)
            assert deactivated_user.is_active is False

            # Confirm the session was revoked.
            await db.refresh(test_session, attribute_names=["revoked_at"])
            assert test_session.revoked_at is not None

            # Confirm no unrevoked session remains.
            remaining_session = (
                await SessionRepository.get_unrevoked_by_user_id(
                    db,
                    user_id,
                )
            )

            assert remaining_session is None

    print("User deactivation tests passed!")


if __name__ == "__main__":
    asyncio.run(main())
