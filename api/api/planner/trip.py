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
            dep_datetime = default_dates[trip.moment].isoformat()
            params = {
                "fromStation": dep_code,
                "toStation": arr_code,
                "plannedFromTime": dep_datetime,
                "travelType": "single",
            }
            tariff_data = []
            try:
                r = requests.get(
                    settings.price_url,
                    params=params,
                    headers=settings.headers(settings.trav_api_key),
                )
                tariff_data = r.json()["priceOptions"][1]["totalPrices"]
            except ConnectionError as e:
                logger.error(f"Didn't fetch NS API result: {e}")
            except (KeyError, IndexError) as e:
                logging.error("Can't parse NS API result")
            trip.tariffs = [Tariff.from_api_payload(td) for td in tariff_data]
        return trips
