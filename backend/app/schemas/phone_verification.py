from typing import Literal

from pydantic import BaseModel, Field


class PhoneVerificationRequest(BaseModel):
    phone_number: str = Field(
        min_length=7,
        max_length=20,
    )
    purpose: Literal["registration", "login"]


class PhoneVerificationConfirm(BaseModel):
    phone_number: str = Field(
        min_length=7,
        max_length=20,
    )
    purpose: Literal["registration", "login"]
    code: str = Field(
        pattern=r"^\d{6}$",
    )


class PhoneVerificationResponse(BaseModel):
    message: str
    expires_in_seconds: int = Field(gt=0)