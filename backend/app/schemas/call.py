import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class CallCreate(BaseModel):
    conversation_id: uuid.UUID
    call_type: Literal["audio", "video"]


class CallResponse(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    initiator_id: uuid.UUID | None
    call_type: Literal["audio", "video"]
    status: Literal[
        "ringing",
        "ongoing",
        "ended",
        "missed",
        "rejected",
        "cancelled",
    ]
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)