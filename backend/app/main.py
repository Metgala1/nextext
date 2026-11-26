from fastapi import FastAPI

app = FastAPI(
    title="NextText API",
    description="Backend API for NexText messaging application",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to the NexText API"}

    