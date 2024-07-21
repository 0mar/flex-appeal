# API for Subscription Picker

## Installation 
Install `poetry` and run `poetry install`

## Running
Make sure you have a PostgreSQL database available. Either installed locally or via Docker. 

### Environment variables
You need an API key for the NS API, as well as for the Travel API. List them as 
`APP_API_KEY` and `TRAV_API_KEY`

```python
python fill_database.py # (only once)
fastapi dev main.py
```
