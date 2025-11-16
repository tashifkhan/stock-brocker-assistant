import os

from dotenv import load_dotenv
from pymongo import ASCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "stock_broker_assistant")

client: MongoClient = MongoClient(MONGODB_URL)
database: Database = client[DATABASE_NAME]


def get_collection(name: str) -> Collection:
    """Return a typed collection handle."""

    return database.get_collection(name)


users_collection: Collection = get_collection("users")

# Ensure useful indexes exist (no-op if already created)
users_collection.create_index([("email", ASCENDING)], unique=True)
users_collection.create_index([("username", ASCENDING)], unique=True)
users_collection.create_index([("reset_token", ASCENDING)], unique=True, sparse=True)
