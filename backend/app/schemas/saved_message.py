import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PinnedMessageResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    message_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StarredMessageResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    message_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)