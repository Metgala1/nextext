from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.health import router as health_router
from app.core.config import settings
from app.db.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the NexText messaging application",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)



@app.get("/")
async def root():
    return {
        "message": "Welcome to the NexText API",
        "environment": settings.ENVIRONMENT
        }

app.include_router(health_router)
