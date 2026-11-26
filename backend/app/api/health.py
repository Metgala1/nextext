from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db


router = APIRouter(tags=["Health"])


@router.get("/health/database")
async def check_database(
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await db.execute(text("SELECT 1"))
        result.scalar_one()

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        )