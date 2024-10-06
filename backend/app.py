from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch, helpers
import pandas as pd
import os
import uvicorn
from dotenv import load_dotenv
from math import ceil

# Load environment variables from .env file
load_dotenv()

class Config:
    ES_USERNAME = os.getenv("ES_USERNAME")
    ES_PASSWORD = os.getenv("ES_PASSWORD")
    ES_HOST = os.getenv("ES_HOST")
    ES_INDEX = os.getenv("ES_INDEX")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

es = Elasticsearch(
    hosts=[Config.ES_HOST],
    http_auth=(Config.ES_USERNAME, Config.ES_PASSWORD),
    timeout=600
)


INDEX_NAME = Config.ES_INDEX
CSV_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dataset", "output.csv")



def reset_elasticsearch_index():
    """
    Reset the Elasticsearch index by deleting and recreating it.
    """
    # Check if index exists, and delete it if it does
    if es.indices.exists(index=INDEX_NAME):
        print(f"Index {INDEX_NAME} exists. Deleting...")
        es.indices.delete(index=INDEX_NAME)
        
    # Define the index mapping
    mapping = {
        "mappings": {
            "properties": {
                "name": {"type": "text"},
                "main_category": {"type": "keyword"},
                "sub_category": {"type": "keyword"},
                "image": {"type": "keyword"},
                "link": {"type": "keyword"},
                "ratings": {"type": "float"},
                "no_of_ratings": {"type": "integer"},
                "discount_price": {"type": "float"},
                "actual_price": {"type": "float"},
                "asin": {"type": "keyword"}
            }
        }
    }

    print(f"Creating index {INDEX_NAME} with mapping: {mapping}")
    # Create the index using the new API syntax
    es.indices.create(
        index=INDEX_NAME,
        body=mapping,
        ignore=[400]
    )
    print(f"Index {INDEX_NAME} created successfully.")

def read_csv_data():
    """
    Read data from the CSV file and return it as a list of dictionaries.
    """
    if not os.path.exists(CSV_FILE_PATH):
        raise FileNotFoundError(f"CSV file '{CSV_FILE_PATH}' not found.")
    
    print(f"Reading CSV file: {CSV_FILE_PATH}")
    # Read CSV file using pandas
    df = pd.read_csv(CSV_FILE_PATH)
    
    # Convert to a list of dictionaries (one dict per row)
    data = df.to_dict(orient="records")
    print(f"CSV data read successfully. Total rows: {len(data)}")
    return data

def index_data_to_elasticsearch(data):
    """
    Index the data into Elasticsearch in batches.
    """
    batch_size = 10000  # Process 1000 documents at a time
    total_documents = len(data)
    processed = 0

    while processed < total_documents:
        batch = data[processed:processed + batch_size]
        actions = [
            {
                "_op_type": "index",
                "_index": INDEX_NAME,
                "_source": item
            }
            for item in batch
        ]
        
        # Bulk index the current batch
        success, failed = helpers.bulk(es, actions, stats_only=True)
        processed += len(batch)
        print(f"Indexed {processed}/{total_documents} documents...")

    print(f"Data indexing completed. Total documents indexed: {processed}")

@app.post("/reset")
async def reset_data():
    """
    Reset the Elasticsearch index and re-index data from CSV file.
    """
    try:
        # Step 1: Reset the Elasticsearch index
        reset_elasticsearch_index()
        
        # Step 2: Read data from the CSV file
        data = read_csv_data()

        # Step 3: Index data into Elasticsearch
        index_data_to_elasticsearch(data)
        
        return {"message": "Data reset successfully and re-indexed into Elasticsearch."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting data: {str(e)}")


@app.get("/search")
async def search_items(
    q: str = None,
    page: int = 1,
    limit: int = 20,
    category: list[str] = Query(default=[]),
    subcategory: list[str] = Query(default=[]),
    min_price: float = None,
    max_price: float = None,
    min_rating: float = None,
    max_rating: float = None,
    sort: str = None
):
    """
    Search for items based on URL query parameters
    """
    try:
        if not q or len(q) < 3:
            raise HTTPException(status_code=400, detail="Search query must be at least 3 characters long.")
        
        if page < 1:
            raise HTTPException(status_code=400, detail="Page number must be greater than or equal to 1.")
                
        from_value = (page - 1) * limit
        
        # Build must and filter conditions as before
        must_conditions = []
        filter_conditions = []
        
        # Add search query condition
        if q:
            must_conditions.append({
                "multi_match": {
                    "query": q,
                    "fields": ["name^2", "description", "main_category", "sub_category"]
                }
            })
            
        # Handle multiple categories only if the list is not empty
        if category:
            must_conditions.append({
                "terms": {
                    "main_category": category
                }
            })
            
        # Handle multiple subcategories only if the list is not empty
        if subcategory:
            must_conditions.append({
                "terms": {
                    "sub_category": subcategory
                }
            })
            
        # Add range filters
        if min_price or max_price:
            price_range = {"range": {"discount_price": {}}}
            if min_price:
                price_range["range"]["discount_price"]["gte"] = min_price
            if max_price:
                price_range["range"]["discount_price"]["lte"] = max_price
            filter_conditions.append(price_range)
            
        if min_rating or max_rating:
            rating_range = {"range": {"ratings": {}}}
            if min_rating:
                rating_range["range"]["ratings"]["gte"] = min_rating
            if max_rating:
                rating_range["range"]["ratings"]["lte"] = max_rating
            filter_conditions.append(rating_range)

        # Add sorting
        sort_options = []
        if sort:
            if sort == "price_asc":
                sort_options.append({"discount_price": "asc"})
            elif sort == "price_desc":
                sort_options.append({"discount_price": "desc"})
            elif sort == "rating_desc":
                sort_options.append({"ratings": "desc"})

        # Construct the query
        query = {
            "query": {
                "bool": {
                    "must": must_conditions if must_conditions else [{"match_all": {}}],
                    "filter": filter_conditions
                }
            },
            "from": from_value,
            "size": limit,
            "sort": sort_options,
            "aggs": {
                "main_categories": {
                    "terms": {"field": "main_category", "size": 50}
                },
                "sub_categories": {
                    "terms": {"field": "sub_category", "size": 50}
                },
                "price_stats": {
                    "stats": {"field": "discount_price"}
                },
                "rating_stats": {
                    "stats": {"field": "ratings"}
                }
            }
        }

        print(f"query: {query}")
        
        # Perform the search query
        response = es.search(index=INDEX_NAME, body=query)

        print(f"response: {response}")
        
        # Return both search results and aggregations
        results = [{**hit['_source'], 'id': hit['_id']} for hit in response['hits']['hits']]
        return {
            "results": results,
            "total": response['hits']['total']['value'],
            "page": page,
            "limit": limit,
            "total_pages": ceil(response['hits']['total']['value'] / limit),
            "aggregations": {
                "categories": response['aggregations']['main_categories']['buckets'],
                "subcategories": response['aggregations']['sub_categories']['buckets'],
                "price_stats": response['aggregations']['price_stats'],
                "rating_stats": response['aggregations']['rating_stats']
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching items: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)