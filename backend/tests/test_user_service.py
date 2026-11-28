import asyncio

from app.db.database import AsyncSessionLocal
import uuid

from app.services.user_service import (
    UserService,
    UserNotFoundError,
)

async def test_deactivate_user():
    import uuid

    async with AsyncSessionLocal() as db:
        async with db.begin():
            user = await UserService.deactivate_user(
                db,
                uuid.UUID(
                    "77556a7d-7153-4ceb-83ae-5a9d8bf5aa98"
                ),
            )

            print("Username:", user.username)
            print("Active:", user.is_active)


async def main():
    await test_deactivate_user()


if __name__ == "__main__":
    asyncio.run(main())