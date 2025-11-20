import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from services.market_filling.india import fetch_recent_india_filings
import json

try:
    print("Fetching India filings...")
    filings = fetch_recent_india_filings(count=5)
    print(json.dumps(filings, indent=2))
except Exception as e:
    print(f"Error: {e}")
