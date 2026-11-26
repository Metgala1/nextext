import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class StatusReplyCreate(BaseModel):
    content: str = Field(min_length=1, max_length=10000)

    @model_validator(mode="after")
    def validate_content(self):
        if not self.content.strip():
            raise ValueError("Reply content cannot be empty.")
        return self


class StatusReplyResponse(BaseModel):
    id: uuid.UUID
    status_id: uuid.UUID
    sender_id: uuid.UUID
    message_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)