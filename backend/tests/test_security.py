
from app.core.security import (
    generate_otp,
    hash_otp,
    verify_otp,
)


def main():
    phone_number = "+237600000001"
    purpose = "registration"

    code = generate_otp()

    assert len(code) == 6
    assert code.isdigit()

    stored_hash = hash_otp(
        code,
        phone_number,
        purpose,
    )

    assert len(stored_hash) == 64

    assert verify_otp(
        code,
        phone_number,
        purpose,
        stored_hash,
    )

    assert not verify_otp(
        "000000",
        phone_number,
        purpose,
        stored_hash,
    )

    assert not verify_otp(
        code,
        "+237600000002",
        purpose,
        stored_hash,
    )

    assert not verify_otp(
        code,
        phone_number,
        "login",
        stored_hash,
    )

    print("OTP security tests passed!")


if __name__ == "__main__":
    main()
