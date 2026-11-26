from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "NexText API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="urf-8",
        extra="ignore"
    )

settings = Settings()