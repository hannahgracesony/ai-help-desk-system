from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..services.gemini_service import generate_ai_response

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class AIRequest(BaseModel):
    query: str

class AIResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=AIResponse)
def ask_ai(request: AIRequest):
    # In a real scenario, this prompt would be more complex and include context
    prompt = f"You are a helpful IT support assistant. A user asks: {request.query}"
    answer = generate_ai_response(prompt)
    return AIResponse(answer=answer)
