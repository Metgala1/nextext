import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import UserRepository

from sqlalchemy.exc import IntegrityError

from app.models.user import User

from app.repositories.session_repository import SessionRepository


class UsernameAlreadyTakenError(Exception):
    pass


class PhoneNumberAlreadyRegisteredError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class UserService:

    @staticmethod
    async def ensure_registration_available(
        db: AsyncSession,
        *,
        username: str,
        phone_number: str,
    ) -> None:
        existing_username = await UserRepository.get_by_username(
            db,
            username,
        )

        if existing_username is not None:
            raise UsernameAlreadyTakenError(
                "This username is already taken."
            )

        existing_phone = await UserRepository.get_by_phone_number(
            db,
            phone_number,
        )

        if existing_phone is not None:
            raise PhoneNumberAlreadyRegisteredError(
                "This phone number is already registered."
            )
    
    @staticmethod
    async def register_user(
        db: AsyncSession,
        *,
        username: str,
        phone_number: str,
        display_name: str | None = None,
    ) -> User:

        await UserService.ensure_registration_available(
            db,
            username=username,
            phone_number=phone_number,
        )

        try:
            # db.begin_nested() creates a savepoint, which is a smaller rollback boundary inside an existing transaction.
            # Why do we need it?
            # Imagine two people register with the same username simultaneously:
            # 1. Both check availability.
            # 2. Both find that the username is available.
            # 3. Both attempt to create an account.
            # 4. PostgreSQL allows one and rejects the other because of the unique index.
            async with db.begin_nested():
                user = await UserRepository.create(
                    db,
                    username=username,
                    phone_number=phone_number,
                    display_name=display_name,
                )

            return user

        except IntegrityError as error:
            constraint_name = getattr(
                getattr(error.orig, "diag", None),
                "constraint_name",
                None,
            )

            if constraint_name == "uq_users_username_lower":
                raise UsernameAlreadyTakenError(
                    "This username is already taken."
                ) from error

            if constraint_name == "users_phone_number_key":
                raise PhoneNumberAlreadyRegisteredError(
                    "This phone number is already registered."
                ) from error

            raise
    
    
    @staticmethod
    async def get_user_by_id(
        db: AsyncSession,
        user_id: uuid.UUID,
    ) -> User:
        user = await UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError("User not found.")

        return user
    
    @staticmethod
    async def get_user_by_username(
        db: AsyncSession,
        username: str,
    ) -> User:
        user = await UserRepository.get_by_username(
            db,
            username,
        )

        if user is None:
            raise UserNotFoundError("User not found.")

        return user
    
    @staticmethod
    async def get_user_by_identifier(
        db: AsyncSession,
        identifier: str,
    ) -> User:
        user = await UserRepository.get_by_username_or_phone(
            db,
            identifier,
        )

        if user is None:
            raise UserNotFoundError("User not found.")

        return user
    
    @staticmethod
    async def update_user(
        db: AsyncSession,
        user_id: uuid.UUID,
        *,
        username: str | None = None,
        display_name: str | None = None,
    ) -> User:
        user = await UserService.get_user_by_id(db, user_id)

        if username is not None and username.lower() != user.username.lower():
            existing_user = await UserRepository.get_by_username(
                db,
                username,
            )

            if existing_user is not None:
                raise UsernameAlreadyTakenError(
                    "This username is already taken."
                )

        try:
            async with db.begin_nested():
                updated_user = await UserRepository.update(
                    db,
                    user,
                    username=username,
                    display_name=display_name,
                )

            return updated_user

        except IntegrityError as error:
            constraint_name = getattr(
                getattr(error.orig, "diag", None),
                "constraint_name",
                None,
            )

            if constraint_name == "uq_users_username_lower":
                raise UsernameAlreadyTakenError(
                    "This username is already taken."
                ) from error

            raise
    
    @staticmethod
    async def deactivate_user(
        db: AsyncSession,
        user_id: uuid.UUID,
    ) -> User:
        user = await UserRepository.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError(
                f"User with id {user_id} was not found"
            )

        async with db.begin_nested():
            user.is_active = False

            session = await SessionRepository.get_unrevoked_by_user_id(
                db,
                user.id,
            )

            if session is not None:
                await SessionRepository.revoke(db, session)

            await db.flush()

        return user