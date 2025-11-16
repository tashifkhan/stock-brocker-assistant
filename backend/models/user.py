from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field


class PyObjectId(ObjectId):
    """Custom validator so Pydantic can handle MongoDB ObjectIds."""

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoModel(BaseModel):
    """Base model with Mongo-friendly configuration."""

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserBase(MongoModel):
    email: EmailStr
    username: str
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(UserBase):
    id: PyObjectId = Field(alias="_id")


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    hashed_password: str
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str


class EmailVerification(BaseModel):
    token: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


class ResendVerification(BaseModel):
    email: EmailStr
