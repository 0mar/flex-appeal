from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_api_key: str
    station_url: str = (
        "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations"
    )
    price_url: str = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips"
    db_uri: str | None
    backend_cors_origins: list[str] = ["http://localhost:5173"]

    def headers(self, key: str) -> dict:
        return {"Ocp-Apim-Subscription-Key": key}

    model_config = SettingsConfigDict(env_file=".env")
