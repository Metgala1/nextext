
import hashlib
import hmac
import secrets

from app.core.config import settings


def generate_otp() -> str:
    """Generate a cryptographically secure six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(
    code: str,
    phone_number: str,
    purpose: str,
) -> str:
    """Create an HMAC-SHA256 digest for an OTP."""

    message = f"{purpose}:{phone_number}:{code}".encode("utf-8")

    secret = settings.OTP_SECRET_KEY.encode("utf-8")

    return hmac.new(
        secret,
        message,
        hashlib.sha256,
    ).hexdigest()


def verify_otp(
    code: str,
    phone_number: str,
    purpose: str,
    stored_hash: str,
) -> bool:
    """Verify an OTP using constant-time comparison."""

    candidate_hash = hash_otp(
        code,
        phone_number,
        purpose,
    )

    return hmac.compare_digest(
        candidate_hash,
        stored_hash,
    )
