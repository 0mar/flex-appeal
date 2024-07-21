FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

ENV APP_PATH="/app"
ENV PYTHONPATH=${APP_PATH}

WORKDIR ${APP_PATH}

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY ./pyproject.toml ./poetry.lock* ${APP_PATH}
RUN poetry install --no-root --only main
COPY . ${APP_PATH}