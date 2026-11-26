import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class ConversationMemberResponse(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    user_id: uuid.UUID
    role: Literal["admin", "member"]
    joined_at: datetime
    left_at: datetime | None
    last_read_at: datetime | None

    model_config = ConfigDict(from_attributes=True)