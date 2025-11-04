from fastapi import FastAPI

from routes import market_filling


app = FastAPI(title="Stock Broker Assistant")


@app.get("/")
def health() -> dict:
    return {
        "status": "ok",
    }


app.include_router(market_filling.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )
