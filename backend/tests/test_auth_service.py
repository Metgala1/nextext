
import asyncio
from uuid import UUID

from app.db.database import AsyncSessionLocal
from app.repositories.phone_verification_repository import (
    PhoneVerificationRepository,
)
from app.services.auth_service import AuthService, MAX_OTP_ATTEMPTS


async def test_successful_confirmation():
    phone_number = "+237699999999"

    async with AsyncSessionLocal() as db:
        async with db.begin():
            # Generate an OTP.
            response = await AuthService.request_otp(
                db,
                phone_number,
                "registration",
            )

            verification_id = UUID(response["verification_id"])
            code = response["development_code"]

            # Confirm the correct OTP.
            result = await AuthService.confirm_otp(
                db,
                verification_id,
                code,
            )

            assert result["verified"] is True

            # Check that the OTP was consumed.
            verification = await PhoneVerificationRepository.get_by_id(
                db,
                verification_id,
            )

            assert verification.consumed_at is not None

            # Attempt to reuse the same OTP.
            try:
                await AuthService.confirm_otp(
                    db,
                    verification_id,
                    code,
                )
                raise AssertionError("A consumed OTP was accepted.")
            except ValueError:
                pass

            print("Successful confirmation and reuse tests passed.")


async def test_failed_attempt_limit():
    phone_number = "+237699999998"

    async with AsyncSessionLocal() as db:
        async with db.begin():
            # Generate an OTP.
            response = await AuthService.request_otp(
                db,
                phone_number,
                "registration",
            )

            verification_id = UUID(response["verification_id"])

            # Submit an incorrect code until the limit is reached.
            for attempt in range(1, MAX_OTP_ATTEMPTS + 1):
                result = await AuthService.confirm_otp(
                    db,
                    verification_id,
                    "000000",
                )

                assert result["verified"] is False
                assert result["attempts_remaining"] == (
                    MAX_OTP_ATTEMPTS - attempt
                )

            # Confirm that the verification was invalidated.
            verification = await PhoneVerificationRepository.get_by_id(
                db,
                verification_id,
            )

            assert verification.attempts == MAX_OTP_ATTEMPTS
            assert verification.invalidated_at is not None

            print("Five-attempt limit test passed.")


if __name__ == "__main__":
    asyncio.run(test_successful_confirmation())
    asyncio.run(test_failed_attempt_limit())
