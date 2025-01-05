from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.routers import products
from src.seed.seed import add_seed_data_if_empty, clean_es_index
from src.core.elasticsearch_utils import es_client

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.on_event("startup")
def init_elasticsearch():
    if not es_client.ping():
        raise Exception("Elasticsearch connection failed")
    

    add_seed_data_if_empty()
    # clean_es_index()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)