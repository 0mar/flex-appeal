from datetime import datetime
from sqlalchemy import select
from api.db.database import Database, Station
from api.common.models import Trip, Tariff
from api.common.definitions import Moment
from api.common.settings import Settings
import requests
import logging

logger = logging.getLogger(__name__)
default_dates = {
    Moment.PIEK: datetime(2024, 1, 2, 8, 30),
    Moment.DAL: datetime(2024, 1, 2, 11, 30),
    Moment.WEEKEND: datetime(2024, 1, 7, 11, 30),
}


def fetch_tariffs(trips: list[Trip], db: Database, settings: Settings):
    with db.session_factory() as session:
        for trip in trips:
            dep_code = session.scalar(
                select(Station.code).where(Station.long == trip.start)
            )
            arr_code = session.scalar(
                select(Station.code).where(Station.long == trip.end)
            )
            dep_datetime = datetime.now().isoformat()
            params = {
                "fromStation": dep_code,
                "toStation": arr_code,
                "dateTime": dep_datetime,
                "travelType": "single",
                "localTrainsOnly": True,
            }
            tariff_data = []
            try:
                r = requests.get(
                    settings.price_url,
                    params=params,
                    headers=settings.headers(settings.app_api_key),
                )
                print(r.url, r.content)
                trip_data = find_optimal_trip(r.json())
                tariff_data = trip_data["fares"]
            except ConnectionError as e:
                logger.error(f"Didn't fetch NS API result: {e}")
            except (KeyError, IndexError) as e:
                logging.error("Can't parse NS API result")
            trip.tariffs = [Tariff.from_api_payload(td) for td in tariff_data]
        return trips


def find_optimal_trip(response: list[dict]) -> dict:
    for trip in response["trips"]:
        if trip["optimal"]:
            return trip
    else:
        raise AttributeError(
            f"No optimal trip found in {len(response[0]['trips'])} trips"
        )
