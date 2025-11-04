from fastapi import APIRouter, Query
from typing import Optional
from services.broker_scrapper.webscrapper import scrape_articles

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/scrape")
def scrape_broker_articles(
    count: int = Query(
        default=5, description="Number of articles to scrape per website"
    ),
    max_articles: int = Query(
        default=1500, description="Maximum total articles to return"
    ),
    websites: Optional[str] = Query(
        default=None, description="Comma-separated list of website URLs"
    ),
) -> dict:
    """
    Scrape articles from financial news websites.

    Args:
        count: Number of articles to fetch per website
        max_articles: Maximum number of articles to return after filtering
        websites: Optional comma-separated list of website URLs to scrape

    Returns:
        Dictionary containing scraped articles and metadata
    """
    website_list = None
    if websites:
        website_list = [url.strip() for url in websites.split(",")]

    result = scrape_articles(
        websites=website_list, count=count, max_articles=max_articles
    )

    return result
