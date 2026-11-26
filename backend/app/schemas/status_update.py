import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class StatusUpdateCreate(BaseModel):
    media_type: Literal["text", "image", "video"]
    content: str | None = Field(default=None, max_length=1000)
    audience_mode: Literal[
        "contacts",
        "contacts_except",
        "only_share_with",
    ] = "contacts"
    audience_user_ids: list[uuid.UUID] = Field(default_factory=list)


class StatusUpdateResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    content: str | None
    media_type: Literal["text", "image", "video"]
    mime_type: str | None
    size_bytes: int | None
    audience_mode: Literal[
        "contacts",
        "contacts_except",
        "only_share_with",
    ]
    created_at: datetime
    expires_at: datetime
    deleted_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


@model_validator(mode="after")
def validate_content(self):
    if self.media_type == "text":
        if self.content is None or not self.content.strip():
            raise ValueError("Text statuses must contain non-empty text.")

    elif self.content is not None and not self.content.strip():
        raise ValueError("Status content cannot be blank.")

    return self