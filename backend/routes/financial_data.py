from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import tempfile
import uuid

from services.process_pdf import convert_pdf_to_md
from services.report_analysis.parameter_generation import generate_evaluation_parameters
from services.report_analysis.summary_generator import generate_report_summary
from services.report_analysis.types import EvaluationParameters

router = APIRouter(prefix="/financial-data", tags=["financial-data"])

# In-memory storage for file uploads (in production, use a database)
uploaded_files = {}


class FileUploadResponse(BaseModel):
    file_id: str
    filename: str
    status: str


class AnalysisRequest(BaseModel):
    file_id: str


class AnalysisResponse(BaseModel):
    file_id: str
    filename: str
    parameters: Optional[EvaluationParameters] = None
    summary: Optional[str] = None
    status: str


@router.post("/upload")
async def upload_financial_document(file: UploadFile = File(...)) -> FileUploadResponse:
    """
    Upload a PDF financial document for analysis.

    Args:
        file: PDF file to upload

    Returns:
        FileUploadResponse with file_id and metadata
    """
    try:
        # Validate file exists and has filename
        if not file.filename or not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        # Generate unique file ID
        file_id = str(uuid.uuid4())

        # Save to temporary location
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"{file_id}.pdf")

        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        # Store metadata
        uploaded_files[file_id] = {
            "filename": file.filename,
            "path": temp_path,
            "status": "uploaded",
        }

        return FileUploadResponse(
            file_id=file_id,
            filename=file.filename,
            status="success",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
def analyze_financial_document(request: AnalysisRequest) -> AnalysisResponse:
    """
    Analyze an uploaded financial document.

    Args:
        request: Contains the file_id of the uploaded document

    Returns:
        AnalysisResponse with generated parameters and summary
    """
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")

        file_info = uploaded_files[request.file_id]
        file_path = file_info["path"]

        # Convert PDF to Markdown
        markdown_content = convert_pdf_to_md(file_path)

        # Generate evaluation parameters
        parameters = generate_evaluation_parameters(markdown_content)

        # Generate summary
        summary = None
        if parameters:
            summary = generate_report_summary(markdown_content, parameters)

        # Update file status
        file_info["status"] = "analyzed"
        file_info["parameters"] = parameters
        file_info["summary"] = summary

        return AnalysisResponse(
            file_id=request.file_id,
            filename=file_info["filename"],
            parameters=parameters,
            summary=summary,
            status="success",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{file_id}")
def get_file_analysis(file_id: str) -> AnalysisResponse:
    """
    Retrieve analysis results for a previously uploaded file.

    Args:
        file_id: The ID of the uploaded file

    Returns:
        AnalysisResponse with analysis results
    """
    try:
        if file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")

        file_info = uploaded_files[file_id]

        return AnalysisResponse(
            file_id=file_id,
            filename=file_info["filename"],
            parameters=file_info.get("parameters"),
            summary=file_info.get("summary"),
            status=file_info["status"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
