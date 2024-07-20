from common.definitions import DiscountType, Moment
from common.models import Trip, Tariff


class BaseSubscriptor:
    name = "Base"

    def __init__(self, trips: list[Trip]):
        self.trips = trips

    def price_per_trip(self, trip: Trip) -> float:
        for moment, discount in self.rules.items():
            if trip.moment in moment:
                if discount == DiscountType.FREE:
                    return 0
                return trip.match_tariff(Tariff(discount_type=discount)).price
        return trip.match_tariff(Tariff(discount_type=DiscountType.NONE)).price

    @property
    def prices_per_trip(self) -> list[float]:
        return [self.price_per_trip(t) for t in self.trips]

    @property
    def base_price(self):
        return self.base_price_unit

    def total_price(self) -> float:
        return self.base_price + sum(self.prices_per_trip)


class Basis(BaseSubscriptor):
    name = "Geen abonnement"
    base_price_unit = 0
    rules = {}


class DalVoordeel(BaseSubscriptor):
    name = "Dal Voordeel"
    base_price_unit = 5.6
    rules = {Moment.DAL: DiscountType.FORTY_PERCENT}


class WeekendVoordeel(BaseSubscriptor):
    name = "Weekend Voordeel"
    base_price_unit = 2.2
    rules = {Moment.WEEKEND: DiscountType.FORTY_PERCENT}


class AltijdVoordeel(BaseSubscriptor):
    name = "Altijd Voordeel"
    base_price_unit = 26.7
    rules = {
        Moment.DAL: DiscountType.FORTY_PERCENT,
        Moment.PIEK: DiscountType.TWENTY_PERCENT,
    }


class DalVrij(BaseSubscriptor):
    name = "Dal vrij"
    base_price_unit = 119.95
    rules = {Moment.DAL: DiscountType.FREE}


class WeekendVrij(BaseSubscriptor):  # Todo: Add other weekend vrij
    name = "Weekend vrij"
    base_price_unit = 34.95
    rules = {
        Moment.WEEKEND: DiscountType.FREE,
        Moment.DAL: DiscountType.FORTY_PERCENT,
    }


class AltijdVrij(BaseSubscriptor):
    name = "Altijd Vrij"
    base_price_unit = 353.80
    rules = {Moment.PIEK: DiscountType.FREE, Moment.DAL: DiscountType.FREE}


all_subs = [
    Basis,
    DalVoordeel,
    WeekendVrij,
    AltijdVoordeel,
    DalVrij,
    AltijdVrij,
]
