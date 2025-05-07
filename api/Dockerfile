FROM python:3.13-slim
ENV APP_PATH="/app"
RUN apt-get update \
    && apt-get -y install libpq-dev gcc 

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . ${APP_PATH}

# Install the application dependencies.
WORKDIR ${APP_PATH}
RUN uv sync --frozen --no-cache

# Run the application.
CMD ["/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]