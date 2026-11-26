import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class MessageAttachmentResponse(BaseModel):
    id: uuid.UUID
    message_id: uuid.UUID
    file_name: str
    mime_type: str
    media_type: Literal["image", "video", "audio", "document"]
    size_bytes: int = Field(gt=0)
    width: int | None
    height: int | None
    duration_seconds: int | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)