import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        user_id: uuid.UUID,
    ) -> User | None:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_phone_number(
        db: AsyncSession,
        phone_number: str,
    ) -> User | None:
        result = await db.execute(
            select(User).where(
                User.phone_number == phone_number
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_username(
        db: AsyncSession,
        username: str,
    ) -> User | None:
        result = await db.execute(
            select(User).where(
                func.lower(User.username) == username.lower()
            )
        )

        return result.scalar_one_or_none()
    
    @staticmethod
    async def create(
        db: AsyncSession,
        *,
        username: str,
        phone_number: str,
        display_name: str | None = None,
    ) -> User:
        user = User(
            username=username,
            phone_number=phone_number,
            display_name=display_name,
        )

        db.add(user)

        await db.flush()

        return user
    
    @staticmethod
    async def get_by_username_or_phone(
        db: AsyncSession,
        identifier: str,
    ) -> User | None:
        result = await db.execute(
            select(User).where(
                or_(
                    func.lower(User.username) == identifier.lower(),
                    User.phone_number == identifier,
                )
            )
        )

        return result.scalar_one_or_none()
    
    @staticmethod
    async def update(
        db: AsyncSession,
        user: User,
        *,
        username: str | None = None,
        display_name: str | None = None,
    ) -> User:
        if username is not None:
            user.username = username

        if display_name is not None:
            user.display_name = display_name

        await db.flush()

        return user
    
    @staticmethod
    async def delete(
        db: AsyncSession,
        user: User,
    ) -> None:
        await db.delete(user)
        await db.flush()