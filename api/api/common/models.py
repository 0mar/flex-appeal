from pydantic import BaseModel, Field
import datetime as dtime
from api.common.definitions import Moment, DiscountType, ProductType, ClassType


class Tariff(BaseModel):
    class_type: ClassType = ClassType.SECOND
    discount_type: DiscountType
    product_type: ProductType = ProductType.SINGLE_FARE
    price: float = 0

    @classmethod
    def from_api_payload(cls, ns_dict: dict):
        return Tariff(
            class_type=ns_dict["classType"].lower(),
            discount_type=ns_dict["discountType"].lower(),
            product_type=ns_dict["productType"].lower(),
            price=ns_dict["price"] / 100,
        )


class Trip(BaseModel):
    id: int
    start: str
    end: str
    moment: Moment
    datetime: dtime.datetime | None = None  # optional, for later
    tariffs: list[Tariff] = []

    def match_tariff(self, tariff_model: Tariff) -> Tariff:
        for t in self.tariffs:
            # hack for convenience and fun
            tariff_model.price = t.price
            if t == tariff_model:
                return t
        raise AttributeError(
            f"No price options for class {tariff_model.class_type},  "
            f"discount {tariff_model.discount_type} "
            f"and product type {tariff_model.product_type}"
        )


class Schedule(BaseModel):
    trips: list[Trip]
    schedule: str


class SubscriptionOffer(BaseModel):
    name: str
    base_price: float
    per_trip_prices: dict[int, float]
    is_best: bool | None = None

    @property
    def total_price(self):
        return self.base_price + sum(self.per_trip_prices.values())
