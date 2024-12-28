import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    ES_USERNAME = os.getenv("ES_USERNAME")
    ES_PASSWORD = os.getenv("ES_PASSWORD")
    ES_HOST = os.getenv("ES_HOST")
    ES_PRODUCTS_INDEX = os.getenv("ES_PRODUCTS_INDEX")
