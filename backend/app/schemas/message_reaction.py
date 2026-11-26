import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MessageReactionCreate(BaseModel):
    message_id: uuid.UUID
    emoji: str = Field(min_length=1, max_length=32)


class MessageReactionResponse(BaseModel):
    id: uuid.UUID
    message_id: uuid.UUID
    user_id: uuid.UUID
    emoji: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)