from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.report_analysis.parameter_generation import generate_evaluation_parameters
from services.report_analysis.parameter_evaluator import (
    generate_evaluated_parameter_code,
)
from services.report_analysis.summary_generator import generate_report_summary
from services.report_analysis.types import EvaluationParameters

router = APIRouter(prefix="/report-analysis", tags=["report-analysis"])


class ReportRequest(BaseModel):
    report: str


class EvaluateParameterRequest(BaseModel):
    report: str
    parameter: EvaluationParameters


class SummaryRequest(BaseModel):
    report: str
    parameters: list[EvaluationParameters]


@router.post("/generate-parameters")
def generate_parameters(request: ReportRequest) -> dict:
    """
    Generate evaluation parameters for a financial report.

    Args:
        request: Contains the financial report text

    Returns:
        Dictionary containing the generated evaluation parameters
    """
    try:
        parameters = generate_evaluation_parameters(request.report)

        if parameters is None:
            raise HTTPException(
                status_code=400,
                detail="Failed to generate evaluation parameters. Please check the report format.",
            )

        return {
            "status": "success",
            "message": "Successfully generated evaluation parameters",
            "parameters": (
                parameters.model_dump()
                if hasattr(parameters, "model_dump")
                else parameters
            ),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating parameters: {str(e)}"
        )


@router.post("/evaluate-parameter")
def evaluate_parameter(request: EvaluateParameterRequest) -> dict:
    """
    Evaluate a specific parameter based on the financial report.

    Args:
        request: Contains the report text and parameter to evaluate

    Returns:
        Dictionary containing the evaluated parameter
    """
    try:
        evaluated = generate_evaluated_parameter_code(request.report, request.parameter)

        return {
            "status": "success",
            "message": "Successfully evaluated parameter",
            "evaluation": evaluated,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error evaluating parameter: {str(e)}"
        )


@router.post("/generate-summary")
def generate_summary(request: SummaryRequest) -> dict:
    """
    Generate a detailed summary of the financial report.

    Args:
        request: Contains the report text and parameters to include

    Returns:
        Dictionary containing the generated summary
    """
    try:
        # Convert list of parameters to a single EvaluationParameters object for the summary
        # For now, we'll pass the first parameter or create a combined representation
        if not request.parameters:
            raise HTTPException(
                status_code=400,
                detail="At least one parameter is required for summary generation",
            )

        # Use the first parameter for now, or you can modify summary_generator to accept a list
        summary = generate_report_summary(request.report, request.parameters[0])

        return {
            "status": "success",
            "message": "Successfully generated report summary",
            "summary": summary,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating summary: {str(e)}"
        )


@router.post("/full-analysis")
def full_analysis(request: ReportRequest) -> dict:
    """
    Perform a complete analysis: generate parameters, evaluate them, and create a summary.

    Args:
        request: Contains the financial report text

    Returns:
        Dictionary containing parameters, evaluations, and summary
    """
    try:
        # Step 1: Generate parameters
        parameters = generate_evaluation_parameters(request.report)

        if parameters is None:
            raise HTTPException(
                status_code=400, detail="Failed to generate evaluation parameters"
            )

        # Step 2: Evaluate the parameter
        evaluation = generate_evaluated_parameter_code(request.report, parameters)

        # Step 3: Generate summary
        summary = generate_report_summary(request.report, parameters)

        return {
            "status": "success",
            "message": "Successfully completed full analysis",
            "parameters": (
                parameters.model_dump()
                if hasattr(parameters, "model_dump")
                else parameters
            ),
            "evaluation": evaluation,
            "summary": summary,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error performing full analysis: {str(e)}"
        )
