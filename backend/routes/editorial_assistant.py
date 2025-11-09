from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from services.editorial_assistant import generate_editorial_article

router = APIRouter(prefix="/editorial-assistant", tags=["editorial"])


class EditorialAssistantRequest(BaseModel):
    market_summary: str = Field(..., description="Narrative overview of current market conditions.")
    reports: List[str] = Field(default_factory=list, description="Key research report highlights.")
    market_filings: List[str] = Field(default_factory=list, description="Notable regulatory filings to reference.")
    tone: str = Field(default="Professional and informative", description="Desired editorial tone.")


class EditorialAssistantResponse(BaseModel):
    headline: str
    subheadline: str
    article: str
    key_points: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
    data_callouts: List[str] = Field(default_factory=list)
    risk_disclaimer: str


@router.post("/generate", response_model=EditorialAssistantResponse)
def create_editorial_article(request: EditorialAssistantRequest) -> EditorialAssistantResponse:
    try:
        payload = generate_editorial_article(
            market_summary=request.market_summary,
            reports=request.reports,
            market_filings=request.market_filings,
            tone=request.tone,
        )
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return EditorialAssistantResponse.model_validate(payload)
