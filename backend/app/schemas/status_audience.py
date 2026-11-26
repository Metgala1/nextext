import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StatusAudienceCreate(BaseModel):
    user_id: uuid.UUID


class StatusAudienceResponse(BaseModel):
    id: uuid.UUID
    status_id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)