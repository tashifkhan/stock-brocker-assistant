from fastapi import FastAPI

from routes import market_filling, article_scrapper, report_analysis


app = FastAPI(title="Stock Broker Assistant")


@app.get("/")
def health() -> dict:
    return {
        "status": "ok",
    }


app.include_router(market_filling.router)
app.include_router(article_scrapper.router)
app.include_router(report_analysis.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )
