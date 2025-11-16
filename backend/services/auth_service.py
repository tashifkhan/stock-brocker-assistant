import asyncio
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext

from models.user import UserCreate, UserInDB
from services.database import users_collection

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[UserInDB]:
        user_dict = await asyncio.to_thread(users_collection.find_one, {"email": email})
        if user_dict:
            return UserInDB(**user_dict)
        return None

    @staticmethod
    async def get_user_by_username(username: str) -> Optional[UserInDB]:
        user_dict = await asyncio.to_thread(
            users_collection.find_one, {"username": username}
        )
        if user_dict:
            return UserInDB(**user_dict)
        return None

    @staticmethod
    async def create_user(user: UserCreate) -> UserInDB:
        existing_user = await asyncio.to_thread(
            users_collection.find_one,
            {
                "$or": [
                    {"email": user.email},
                    {"username": user.username},
                ]
            },
        )
        if existing_user:
            raise ValueError("User with this email or username already exists")

        now = datetime.utcnow()
        user_document = {
            "email": user.email,
            "username": user.username,
            "hashed_password": AuthService.get_password_hash(user.password),
            "is_active": True,
            "is_verified": False,
            "created_at": now,
            "updated_at": now,
            "reset_token": None,
            "reset_token_expires": None,
        }

        result = await asyncio.to_thread(users_collection.insert_one, user_document)
        user_document["_id"] = result.inserted_id
        return UserInDB(**user_document)

    @staticmethod
    async def authenticate_user(identifier: str, password: str) -> Optional[UserInDB]:
        user = await AuthService.get_user_by_email(identifier)
        if not user:
            user = await AuthService.get_user_by_username(identifier)
        if not user:
            return None
        if not AuthService.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def create_reset_token(email: str) -> str:
        user = await AuthService.get_user_by_email(email)
        if not user:
            raise ValueError("User not found")

        reset_token = secrets.token_urlsafe(32)
        expires = datetime.utcnow() + timedelta(hours=1)

        await asyncio.to_thread(
            users_collection.update_one,
            {"_id": user.id},
            {
                "$set": {
                    "reset_token": reset_token,
                    "reset_token_expires": expires,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return reset_token

    @staticmethod
    async def verify_reset_token(token: str) -> Optional[UserInDB]:
        user_dict = await asyncio.to_thread(
            users_collection.find_one,
            {
                "reset_token": token,
                "reset_token_expires": {"$gt": datetime.utcnow()},
            },
        )
        if user_dict:
            return UserInDB(**user_dict)
        return None

    @staticmethod
    async def reset_password(token: str, new_password: str) -> bool:
        user = await AuthService.verify_reset_token(token)
        if not user:
            return False

        hashed_password = AuthService.get_password_hash(new_password)
        await asyncio.to_thread(
            users_collection.update_one,
            {"_id": user.id},
            {
                "$set": {
                    "hashed_password": hashed_password,
                    "reset_token": None,
                    "reset_token_expires": None,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return True

    @staticmethod
    async def verify_email_token(token: str) -> Optional[UserInDB]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if email is None:
                return None
        except JWTError:
            return None

        user = await AuthService.get_user_by_email(email)
        if user and not user.is_verified:
            await asyncio.to_thread(
                users_collection.update_one,
                {"_id": user.id},
                {
                    "$set": {
                        "is_verified": True,
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
            user.is_verified = True
            return user
        return None

    @staticmethod
    async def update_password(user_id, hashed_password: str) -> None:
        await asyncio.to_thread(
            users_collection.update_one,
            {"_id": user_id},
            {
                "$set": {
                    "hashed_password": hashed_password,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
