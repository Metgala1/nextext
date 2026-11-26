import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class CallParticipantResponse(BaseModel):
    id: uuid.UUID
    call_id: uuid.UUID
    user_id: uuid.UUID
    status: Literal[
        "invited",
        "ringing",
        "joined",
        "left",
        "declined",
        "missed",
    ]
    joined_at: datetime | None
    left_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)