from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

router = APIRouter(prefix="/market-summary", tags=["market-summary"])


class MarketMetric(BaseModel):
    name: str
    value: float
    change: float
    change_percent: float
    trend: str  # "up", "down", "neutral"


class MarketSummaryResponse(BaseModel):
    date: date
    indices: list[MarketMetric]
    top_gainers: list[dict]
    top_losers: list[dict]
    market_news: list[dict]
    status: str


@router.get("/daily")
def get_daily_market_summary(date_str: Optional[str] = Query(None, description="Date in YYYY-MM-DD format")) -> MarketSummaryResponse:
    """
    Get daily market summary including indices, gainers, losers, and top news.

    Args:
        date_str: Optional date to fetch summary for (defaults to today)

    Returns:
        MarketSummaryResponse with market data for the day
    """
    try:
        # Parse date or use today
        if date_str:
            summary_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        else:
            summary_date = date.today()

        # Placeholder market data (in production, fetch from real market data APIs)
        indices = [
            MarketMetric(
                name="S&P 500",
                value=4500.0,
                change=45.5,
                change_percent=1.02,
                trend="up",
            ),
            MarketMetric(
                name="Nifty 50",
                value=21500.0,
                change=120.0,
                change_percent=0.56,
                trend="up",
            ),
            MarketMetric(
                name="Sensex",
                value=70500.0,
                change=250.0,
                change_percent=0.36,
                trend="up",
            ),
        ]

        top_gainers = [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 189.5, "change_percent": 3.2},
            {"symbol": "MSFT", "name": "Microsoft Corp.", "price": 425.0, "change_percent": 2.8},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 142.5, "change_percent": 2.1},
        ]

        top_losers = [
            {"symbol": "META", "name": "Meta Platforms", "price": 312.5, "change_percent": -1.5},
            {"symbol": "NVDA", "name": "NVIDIA Corp.", "price": 875.0, "change_percent": -0.8},
        ]

        market_news = [
            {
                "title": "Federal Reserve signals potential rate cuts",
                "source": "Reuters",
                "timestamp": datetime.now().isoformat(),
            },
            {
                "title": "Tech stocks rally on earnings reports",
                "source": "Bloomberg",
                "timestamp": datetime.now().isoformat(),
            },
        ]

        return MarketSummaryResponse(
            date=summary_date,
            indices=indices,
            top_gainers=top_gainers,
            top_losers=top_losers,
            market_news=market_news,
            status="success",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sectors")
def get_sector_performance(date_str: Optional[str] = Query(None)) -> dict:
    """
    Get performance metrics for all market sectors.

    Args:
        date_str: Optional date in YYYY-MM-DD format

    Returns:
        Dictionary with sector performance data
    """
    try:
        sectors = {
            "Technology": {"change": 2.3, "leaders": ["AAPL", "MSFT"]},
            "Healthcare": {"change": 1.8, "leaders": ["JNJ", "UNH"]},
            "Finance": {"change": 1.2, "leaders": ["JPM", "BAC"]},
            "Energy": {"change": -0.5, "leaders": ["XOM", "CVX"]},
            "Consumer": {"change": 0.8, "leaders": ["AMZN", "WMT"]},
        }

        return {
            "sectors": sectors,
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/watchlist")
def get_watchlist_performance(symbols: str = Query(..., description="Comma-separated stock symbols")) -> dict:
    """
    Get performance data for a custom watchlist.

    Args:
        symbols: Comma-separated list of stock symbols

    Returns:
        Dictionary with watchlist performance data
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]

        watchlist_data = []
        for symbol in symbol_list:
            watchlist_data.append({
                "symbol": symbol,
                "price": 100.0,
                "change": 2.5,
                "change_percent": 2.5,
                "volume": 1000000,
            })

        return {
            "watchlist": watchlist_data,
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
