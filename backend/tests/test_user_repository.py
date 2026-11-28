import asyncio

from app.db.database import AsyncSessionLocal
from app.repositories.user_repository import UserRepository


async def main():
    async with AsyncSessionLocal() as db:
        async with db.begin():
            user = await UserRepository.create(
                db,
                username="delete_test",
                phone_number="+237600000002",
                display_name="Temporary User",
            )

            print("Created:", user.username)

            await UserRepository.delete(db, user)

            print("Deletion executed")


if __name__ == "__main__":
    asyncio.run(main())