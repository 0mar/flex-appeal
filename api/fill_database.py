from db.database import Database, Station
from common.settings import Settings
import requests
import json


def fetch_stations(settings: Settings) -> list[dict]:
    r = requests.get(
        settings.station_url, headers=settings.headers(settings.app_api_key)
    )
    return r.json()["payload"]


def init_database(settings: Settings):
    db = Database(settings.db_uri)
    db.clean_database()
    with db.session_factory.begin() as session:
        for entry in fetch_stations(settings):
            if entry["land"] != "NL":
                continue
            kwargs = {
                "code": entry["code"],
                "latitude": entry["lat"],
                "longitude": entry["lng"],
                "short": entry["namen"]["kort"],
                "medium": entry["namen"]["middel"],
                "long": entry["namen"]["lang"],
            }
            session.add(Station(**kwargs))


if __name__ == "__main__":
    settings = Settings()
    init_database(settings)
