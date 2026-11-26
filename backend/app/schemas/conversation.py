import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    type: Literal["direct", "group"]
    participant_ids: list[uuid.UUID] = Field(min_length=1)
    title: str | None = Field(default=None, max_length=100)


class ConversationResponse(BaseModel):
    id: uuid.UUID
    type: str
    title: str | None
    created_by_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)