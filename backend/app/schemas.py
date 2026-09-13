from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- MESSAGE SCHEMAS ---
class MessageBase(BaseModel):
    content: str
    is_ai: bool = False

class MessageCreate(MessageBase):
    sender_id: Optional[int] = None

class MessageResponse(MessageBase):
    id: int
    ticket_id: int
    sender_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- TICKET SCHEMAS ---
class TicketBase(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "medium"

class TicketCreate(TicketBase):
    creator_id: int

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_agent_id: Optional[int] = None

class TicketResponse(TicketBase):
    id: int
    status: str
    creator_id: int
    assigned_agent_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TicketDetailResponse(TicketResponse):
    messages: List[MessageResponse] = []
