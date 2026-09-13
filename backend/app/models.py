from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from .database import Base

class RoleEnum(str, enum.Enum):
    user = "user"
    agent = "agent"
    admin = "admin"

class TicketStatusEnum(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"
    escalated = "escalated"

class PriorityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)
    
    # Relationships
    tickets_created = relationship("Ticket", foreign_keys="[Ticket.creator_id]", back_populates="creator")
    tickets_assigned = relationship("Ticket", foreign_keys="[Ticket.assigned_agent_id]", back_populates="assigned_agent")
    messages = relationship("Message", back_populates="sender")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.medium)
    status = Column(Enum(TicketStatusEnum), default=TicketStatusEnum.open)
    
    creator_id = Column(Integer, ForeignKey("users.id"))
    assigned_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    # Relationships
    creator = relationship("User", foreign_keys=[creator_id], back_populates="tickets_created")
    assigned_agent = relationship("User", foreign_keys=[assigned_agent_id], back_populates="tickets_assigned")
    messages = relationship("Message", back_populates="ticket")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    is_ai = Column(Integer, default=0) # 1 if AI message, 0 otherwise
    
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Null if AI
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    ticket = relationship("Ticket", back_populates="messages")
    sender = relationship("User", back_populates="messages")
