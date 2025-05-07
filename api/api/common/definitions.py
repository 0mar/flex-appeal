from enum import StrEnum, auto, Flag


class Moment(Flag):
    PIEK = auto()
    WEEKEND = auto()
    WEEK_DAL = auto()
    DAL = WEEKEND | WEEK_DAL


class ClassType(StrEnum):
    SECOND = "SECOND_CLASS"
    FIRST = "FIRST_CLASS"


class DiscountType(StrEnum):
    NONE = "NO_DISCOUNT"
    TWENTY_PERCENT = "DISCOUNT_20_PERCENT"
    FORTY_PERCENT = "DISCOUNT_40_PERCENT"
    FREE = "FREE"  # not present in NS API


class ProductType(StrEnum):
    SINGLE_FARE = "OVCHIPKAART_ENKELE_REIS"
    RETURN_FARE = "OVCHIPKAART_RETOUR"
    TRAJECTVRIJ_JAAR = "TRAJECT_VRIJ_JAAR"
    BUSINESSCARD_TRAJECTVRIJ_JAAR = "BUSINESS_CARD_TRAJECT_VRIJ_JAAR"
