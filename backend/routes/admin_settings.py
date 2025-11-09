from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter(prefix="/admin", tags=["admin"])


class SystemMetrics(BaseModel):
    uptime_hours: float
    memory_usage_percent: float
    cpu_usage_percent: float
    disk_usage_percent: float
    active_users: int
    total_requests: int


class AppSettings(BaseModel):
    app_name: str
    version: str
    debug_mode: bool
    cache_enabled: bool
    log_level: str
    max_upload_size_mb: int


class SettingsUpdateRequest(BaseModel):
    key: str
    value: Any


@router.get("/metrics")
def get_system_metrics() -> Dict[str, Any]:
    """
    Get system health and performance metrics.

    Returns:
        Dictionary with system metrics
    """
    try:
        metrics = SystemMetrics(
            uptime_hours=24.5,
            memory_usage_percent=45.2,
            cpu_usage_percent=12.8,
            disk_usage_percent=62.3,
            active_users=5,
            total_requests=15230,
        )

        return {
            "metrics": metrics.model_dump(),
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/settings")
def get_application_settings() -> Dict[str, Any]:
    """
    Get current application settings.

    Returns:
        Dictionary with application settings
    """
    try:
        settings = AppSettings(
            app_name="Stock Broker Assistant",
            version="0.1.0",
            debug_mode=False,
            cache_enabled=True,
            log_level="INFO",
            max_upload_size_mb=50,
        )

        return {
            "settings": settings.model_dump(),
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings")
def update_application_settings(request: SettingsUpdateRequest) -> Dict[str, Any]:
    """
    Update application settings.

    Args:
        request: Contains the key and new value for a setting

    Returns:
        Dictionary with updated settings
    """
    try:
        # Placeholder for settings update logic
        # In production, persist to database or config file
        updated_value = request.value

        return {
            "key": request.key,
            "value": updated_value,
            "status": "success",
            "message": f"Successfully updated {request.key}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users")
def list_users(limit: int = 10, offset: int = 0) -> Dict[str, Any]:
    """
    List all application users.

    Args:
        limit: Maximum number of users to return
        offset: Pagination offset

    Returns:
        Dictionary with list of users
    """
    try:
        # Placeholder for users list
        users = [
            {
                "id": 1,
                "username": "admin",
                "email": "admin@example.com",
                "role": "admin",
                "created_at": "2024-01-01T00:00:00",
            },
            {
                "id": 2,
                "username": "user1",
                "email": "user1@example.com",
                "role": "analyst",
                "created_at": "2024-01-05T00:00:00",
            },
        ]

        return {
            "users": users,
            "total": len(users),
            "limit": limit,
            "offset": offset,
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs")
def get_application_logs(limit: int = 100) -> Dict[str, Any]:
    """
    Get recent application logs.

    Args:
        limit: Maximum number of log entries to return

    Returns:
        Dictionary with recent logs
    """
    try:
        # Placeholder for logs
        logs = [
            {
                "timestamp": "2024-11-08T10:00:00",
                "level": "INFO",
                "message": "Application started",
                "source": "main.py",
            },
            {
                "timestamp": "2024-11-08T10:01:00",
                "level": "INFO",
                "message": "API request to /articles/scrape",
                "source": "article_scrapper.py",
            },
            {
                "timestamp": "2024-11-08T10:02:00",
                "level": "WARNING",
                "message": "High memory usage detected",
                "source": "system.py",
            },
        ]

        return {
            "logs": logs[:limit],
            "total": len(logs),
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Settings routes
class SettingsRequest(BaseModel):
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    email_digest_frequency: Optional[str] = None
    language: Optional[str] = None


@router.get("/settings/user")
def get_user_settings() -> Dict[str, Any]:
    """
    Get current user's settings and preferences.

    Returns:
        Dictionary with user settings
    """
    try:
        settings = {
            "theme": "dark",
            "notifications_enabled": True,
            "email_digest_frequency": "daily",
            "language": "en",
            "timezone": "UTC",
        }

        return {
            "settings": settings,
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/user")
def update_user_settings(request: SettingsRequest) -> Dict[str, Any]:
    """
    Update user settings and preferences.

    Args:
        request: Settings to update

    Returns:
        Dictionary with updated settings
    """
    try:
        updated_settings = {
            "theme": request.theme or "dark",
            "notifications_enabled": request.notifications_enabled if request.notifications_enabled is not None else True,
            "email_digest_frequency": request.email_digest_frequency or "daily",
            "language": request.language or "en",
        }

        return {
            "settings": updated_settings,
            "status": "success",
            "message": "Settings updated successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
