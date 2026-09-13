from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .models import RoleEnum, TicketStatusEnum, PriorityEnum

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: str
    role: RoleEnum = RoleEnum.user

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    
    class Config:
        orm_mode = True

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
        orm_mode = True

# --- TICKET SCHEMAS ---
class TicketBase(BaseModel):
    title: str
    description: str
    category: str
    priority: PriorityEnum = PriorityEnum.medium

class TicketCreate(TicketBase):
    creator_id: int

class TicketUpdate(BaseModel):
    status: Optional[TicketStatusEnum] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    assigned_agent_id: Optional[int] = None

class TicketResponse(TicketBase):
    id: int
    status: TicketStatusEnum
    creator_id: int
    assigned_agent_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class TicketDetailResponse(TicketResponse):
    messages: List[MessageResponse] = []
