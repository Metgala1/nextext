import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserBlockCreate(BaseModel):
    blocked_user_id: uuid.UUID


class UserBlockResponse(BaseModel):
    id: uuid.UUID
    blocked_user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)