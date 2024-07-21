from sqlalchemy import (
    Float,
    String,
    create_engine,
    inspect,
)

from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    sessionmaker,
)


class Base(DeclarativeBase):
    pass


class Station(Base):
    __tablename__ = "station"
    code: Mapped[str] = mapped_column(String, primary_key=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    short: Mapped[str] = mapped_column(String)
    medium: Mapped[str] = mapped_column(String)
    long: Mapped[str] = mapped_column(String)


class Database:
    def __init__(self, db_uri):
        self.engine = create_engine(db_uri)
        self.session_factory = sessionmaker(self.engine)

    @property
    def initalized(self) -> bool:
        return inspect(self.engine).has_table("station")

    def clean_database(self):
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)
