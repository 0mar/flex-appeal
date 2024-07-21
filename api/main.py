from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from api.common.models import Schedule, SubscriptionOffer
from api.common.settings import Settings
from api.db.database import Database, Station
from api.planner.subscriptions import all_subs
from api.planner.trip import fetch_tariffs

app = FastAPI()
settings = Settings()

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = Database(settings.db_uri)
    try:
        yield db
    finally:
        pass


@app.get("/")
async def root():
    return {"message": "Hello world"}


@app.get("/get_stations/")
async def get_stations(db: Database = Depends(get_db)) -> dict[str, list]:
    with db.session_factory() as session:
        return {"stations": session.scalars(select(Station.long)).all()}


@app.post("/get_prices/")
async def get_prices(
    s: Schedule, db: Database = Depends(get_db)
) -> list[SubscriptionOffer]:
    fetch_tariffs(s.trips, db, settings)
    offers = []
    for Sub in all_subs:
        sub = Sub(s.trips)
        offer = SubscriptionOffer(
            name=sub.name,
            base_price=sub.base_price_unit,
            per_trip_prices={trip.id: sub.price_per_trip(trip) for trip in s.trips},
        )
        offers.append(offer)
        offer.is_best = False
    min_offer = min(offers, key=lambda x: x.total_price)
    min_offer.is_best = True
    offers.sort(key=lambda x: x.total_price)
    return offers[:3]
