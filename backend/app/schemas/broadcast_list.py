import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BroadcastListCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class BroadcastListUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class BroadcastListResponse(BaseModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)