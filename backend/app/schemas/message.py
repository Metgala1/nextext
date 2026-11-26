import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class MessageCreate(BaseModel):
    conversation_id: uuid.UUID
    content: str | None = Field(default=None, max_length=10000)

    @model_validator(mode="after")
    def validate_content(self):
        if self.content is not None and not self.content.strip():
            raise ValueError("Message content cannot be empty.")

        return self


class MessageUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=10000)

    @model_validator(mode="after")
    def validate_content(self):
        if not self.content.strip():
            raise ValueError("Message content cannot be empty.")

        return self


class MessageResponse(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: uuid.UUID | None
    content: str | None
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = ConfigDict(from_attributes=True)