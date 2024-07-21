from enum import StrEnum, auto, Flag


class Moment(Flag):
    PIEK = auto()
    WEEKEND = auto()
    WEEK_DAL = auto()
    DAL = WEEKEND | WEEK_DAL


class ClassType(StrEnum):
    SECOND = auto()
    FIRST = auto()


class DiscountType(StrEnum):
    NONE = auto()
    TWENTY_PERCENT = auto()
    FORTY_PERCENT = auto()
    FREE = auto()  # not present in NS API


class ProductType(StrEnum):
    SINGLE_FARE = auto()
    RETURN_FARE = auto()
    TRAJECTVRIJ_NSBUSINESSKAART = auto()
    TRAJECTVRIJ_MAAND = auto()
    TRAJECTVRIJ_JAAR = auto()
