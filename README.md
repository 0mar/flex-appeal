# FlexAppeal

Compare NS subscriptions based on your travels

## Setup

Uses [Docker Compose](https://docs.docker.com/compose/) to run locally. Requires [NS API](https://www.ns.nl/en/travel-information/ns-api) keys. To set up, do the following

1. Get an App registration key and a travel API key from the NS API portal (requires signing up).

2. Clone the repository and enter
```bash
git clone git@github.com:0mar/flex-appeal.git
cd flex-appeal
```

3. Store the keys in a `.env` file.
```bash
APP_API_KEY=<app-registraion-key>
TRAV_API_KEY=<travel-api-key>
```

4. Build the frontend and backend images.
```bash
docker compose build
docker compose run api python fill_database.py
```

## Run

5. Run the app:
```bash
docker compose up
```

Visit `localhost` in your browser and compare your subscriptions.
