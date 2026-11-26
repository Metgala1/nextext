import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContactCreate(BaseModel):
    contact_user_id: uuid.UUID


class ContactResponse(BaseModel):
    id: uuid.UUID
    contact_user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)