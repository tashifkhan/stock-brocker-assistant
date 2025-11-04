from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict

# import the service modules
from services.market_filling import us as us_service
from services.market_filling import india as india_service


router = APIRouter(
    prefix="/market-filling",
    tags=["market_filling"],
)


@router.get("/us")
def get_us_filings(count: int = Query(10, ge=1, le=100)) -> Dict[str, object]:
    """Return recent US filings from the SEC feed.

    Query param:
    - count: number of entries to fetch (default 10, 1-100)
    """

    try:
        results: List[Dict[str, str]] = us_service.fetch_recent_sec_filings(count=count)
        return {
            "source": "us",
            "count": len(results),
            "results": results,
        }

    except Exception as exc:  # pragma: no cover - surface errors to client
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )


@router.get("/india")
def get_india_filings(count: int = Query(10, ge=1, le=100)) -> Dict[str, object]:
    """Return recent India filings/announcements from SEBI.

    Query param:
    - count: number of entries to fetch (default 10, 1-100)
    """

    try:
        results: List[Dict[str, str]] = india_service.fetch_recent_india_filings(
            count=count
        )
        return {
            "source": "india",
            "count": len(results),
            "results": results,
        }

    except Exception as exc:  # pragma: no cover - surface errors to client
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )
