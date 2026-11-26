import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageReceiptResponse(BaseModel):
    id: uuid.UUID
    message_id: uuid.UUID
    user_id: uuid.UUID
    delivered_at: datetime | None
    read_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)