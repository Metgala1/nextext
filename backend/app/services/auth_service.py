
from datetime import datetime, timedelta, timezone
from typing import Literal
import re

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import generate_otp, hash_otp
from app.repositories.phone_verification_repository import (
    PhoneVerificationRepository,
)
from app.core.config import settings
from app.repositories.user_repository import UserRepository
from app.core.security import generate_otp, hash_otp, verify_otp
from uuid import UUID


OTP_EXPIRY_MINUTES = 5
MAX_OTP_ATTEMPTS = 5

VerificationPurpose = Literal["registration", "login"]


class AuthService:

    @staticmethod
    def validate_phone_number(phone_number: str) -> str:
        phone_number = phone_number.strip()

        if not re.fullmatch(r"\+[1-9]\d{7,14}", phone_number):
            raise ValueError(
                "Phone number must use international format, "
                "for example +237XXXXXXXXX."
            )

        return phone_number

    
    @staticmethod
    async def request_otp(
        db: AsyncSession,
        phone_number: str,
        purpose: VerificationPurpose,
    ) -> dict:
        phone_number = AuthService.validate_phone_number(phone_number)

        # Check whether the phone number is eligible.
        user = await UserRepository.get_by_phone_number(
            db,
            phone_number,
        )

        if purpose == "registration" and user is not None:
            raise ValueError("This phone number is already registered.")

        if purpose == "login":
            if user is None or not user.is_active:
                raise ValueError("Unable to send a verification code.")

        # Generate the OTP and its secure hash.
        code = generate_otp()

        code_hash = hash_otp(
            code,
            phone_number,
            purpose,
        )

        expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=OTP_EXPIRY_MINUTES
        )

        # Replace any previous pending codes and save the new one.
        async with db.begin_nested():
            await PhoneVerificationRepository.invalidate_pending(
                db,
                phone_number,
                purpose,
            )

            verification = await PhoneVerificationRepository.create(
                db,
                phone_number=phone_number,
                code_hash=code_hash,
                purpose=purpose,
                expires_at=expires_at,
            )

        response = {
            "message": "Verification code generated.",
            "verification_id": str(verification.id),
            "expires_in_seconds": OTP_EXPIRY_MINUTES * 60,
        }

        # Never expose the development OTP in production.
        if settings.ENVIRONMENT == "development":
            response["development_code"] = code

        return response
    
    @staticmethod
    async def confirm_otp(
        db: AsyncSession,
        verification_id: UUID,
        code: str,
    ) -> dict:
        # 1. Lock and retrieve the verification record.
        verification = (
            await PhoneVerificationRepository.get_by_id_for_update(
                db,
                verification_id,
            )
        )

        if verification is None:
            raise ValueError("Invalid or expired verification code.")

        # 2. Reject codes that are no longer usable.
        now = datetime.now(timezone.utc)

        if (
            verification.consumed_at is not None
            or verification.invalidated_at is not None
            or verification.expires_at <= now
            or verification.attempts >= MAX_OTP_ATTEMPTS
        ):
            raise ValueError("Invalid or expired verification code.")

        # 3. Verify the submitted code.
        is_valid = verify_otp(
            code,
            verification.phone_number,
            verification.purpose,
            verification.code_hash,
        )

        # 4. Handle an incorrect code.
        if not is_valid:
            attempts = (
                await PhoneVerificationRepository.increment_attempts(
                    db,
                    verification.id,
                )
            )

            attempts_remaining = max(
                0,
                MAX_OTP_ATTEMPTS - attempts,
            )

            # Invalidate the code once the attempt limit is reached.
            if attempts >= MAX_OTP_ATTEMPTS:
                await PhoneVerificationRepository.invalidate(
                    db,
                    verification,
                )

            return {
                "verified": False,
                "message": "Incorrect verification code.",
                "attempts_remaining": attempts_remaining,
            }

        # 5. Consume a successful code so it cannot be reused.
        await PhoneVerificationRepository.consume(
            db,
            verification,
        )

        return {
            "verified": True,
            "message": "Phone number verified successfully.",
            "attempts_remaining": MAX_OTP_ATTEMPTS - verification.attempts,
        }
