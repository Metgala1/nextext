import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BroadcastMessageResponse(BaseModel):
    id: uuid.UUID
    broadcast_list_id: uuid.UUID
    recipient_id: uuid.UUID
    message_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)