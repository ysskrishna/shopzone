from src.core.config import Config
from elasticsearch import Elasticsearch, helpers

es_client = Elasticsearch(
    hosts=[Config.ES_HOST],
    http_auth=(Config.ES_USERNAME, Config.ES_PASSWORD),
    timeout=600
)


class ElasticSearchHelper:
    def __init__(self, es = es_client, products_index = Config.ES_PRODUCTS_INDEX):
        self.es = es
        self.products_index = products_index

    def reset_products_index(self):
        if self.es.indices.exists(index=self.products_index):
            print(f"Products Index {self.products_index} exists. Deleting...")
            self.es.indices.delete(index=self.products_index)

        # Define the products index mapping
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

        print(f"Creating index {self.products_index} with mapping: {mapping}")
        # Create the index using the new API syntax
        self.es.indices.create(
            index=self.products_index,
            body=mapping,
            ignore=[400]
        )
        print(f"Products Index {self.products_index} created successfully.")
    
    def get_products_count(self):
        return self.es.count(index=self.products_index)['count']

    def add_products_bulk(self, data):
        batch_size = 10000  # Process 1000 documents at a time
        total_documents = len(data)
        processed = 0

        while processed < total_documents:
            batch = data[processed:processed + batch_size]
            actions = [
                {
                    "_op_type": "index",
                    "_index": self.products_index,
                    "_source": item
                }
                for item in batch
            ]
            
            # Bulk index the current batch
            success, failed = helpers.bulk(self.es, actions, stats_only=True)
            processed += len(batch)
            print(f"Indexed {processed}/{total_documents} products...")

        print(f"Total products indexed: {processed}")
