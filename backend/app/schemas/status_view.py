import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StatusViewResponse(BaseModel):
    id: uuid.UUID
    status_id: uuid.UUID
    viewer_id: uuid.UUID
    viewed_at: datetime

    model_config = ConfigDict(from_attributes=True)