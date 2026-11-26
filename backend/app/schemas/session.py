import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SessionResponse(BaseModel):
    id: uuid.UUID
    created_at: datetime
    expires_at: datetime
    last_seen_at: datetime | None

    model_config = ConfigDict(from_attributes=True)