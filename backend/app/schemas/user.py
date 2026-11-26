import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    phone_number: str = Field(min_length=7, max_length=20)
    display_name: str | None = Field(
        default=None,
        max_length=80,
    )


class UserUpdate(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=30,
    )
    display_name: str | None = Field(
        default=None,
        max_length=80,
    )


class UserResponse(BaseModel):
    id: uuid.UUID
    username: str
    phone_number: str
    display_name: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)