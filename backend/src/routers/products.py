from fastapi import APIRouter, HTTPException, Query
from math import ceil

from src.core.elasticsearch_utils import es_client
from src.core.config import Config

router = APIRouter()



@router.get("/search")
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
            filter_conditions.append({
                "terms": {
                    "main_category": category
                }
            })
            
        # Handle multiple subcategories only if the list is not empty
        if subcategory:
            filter_conditions.append({
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
            elif sort == "relevance":
                sort_options.append("_score")  # Sort by relevance score
        else:
            sort_options.append("_score")  # Default to relevance sorting

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
        
        # Create a separate query for aggregations using only must_conditions
        aggs_query = {
            "query": {
                "bool": {
                    "must": must_conditions if must_conditions else [{"match_all": {}}]
                }
            },
            "size": 0,  # We don't need hits for aggregations
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

        # Perform both queries
        search_response = es_client.search(index=Config.ES_PRODUCTS_INDEX, body=query)
        aggs_response = es_client.search(index=Config.ES_PRODUCTS_INDEX, body=aggs_query)
        
        # Return both search results and unfiltered aggregations
        results = [{**hit['_source'], 'id': hit['_id']} for hit in search_response['hits']['hits']]
        return {
            "results": results,
            "total": search_response['hits']['total']['value'],
            "page": page,
            "limit": limit,
            "total_pages": ceil(search_response['hits']['total']['value'] / limit),
            "aggregations": {
                "categories": aggs_response['aggregations']['main_categories']['buckets'],
                "subcategories": aggs_response['aggregations']['sub_categories']['buckets'],
                "price_stats": aggs_response['aggregations']['price_stats'],
                "rating_stats": aggs_response['aggregations']['rating_stats']
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching items: {str(e)}")

@router.get("/product/{product_id}")
async def get_product(product_id: str):
    """
    Get a product by its Elasticsearch ID
    """
    try:
        response = es_client.get(
            index=Config.ES_PRODUCTS_INDEX,
            id=product_id
        )
        
        if response['found']:
            return {**response['_source'], 'id': response['_id']}
        else:
            raise HTTPException(status_code=404, detail="Product not found")
            
    except Exception as e:
        if "404" in str(e):
            raise HTTPException(status_code=404, detail="Product not found")
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")

@router.get("/product/{product_id}/recommendations")
async def get_product_recommendations(
    product_id: str,
    limit: int = 10
):
    """
    Get similar product recommendations based on a product ID
    """
    try:
        # First, get the source product
        source_product = es_client.get(
            index=Config.ES_PRODUCTS_INDEX,
            id=product_id
        )
        
        if not source_product['found']:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # Construct more_like_this query
        query = {
            "query": {
                "more_like_this": {
                    "fields": ["name", "description", "main_category", "sub_category"],
                    "like": [
                        {
                            "_index": Config.ES_PRODUCTS_INDEX,
                            "_id": product_id
                        }
                    ],
                    "min_term_freq": 1,
                    "max_query_terms": 25,
                    "min_doc_freq": 1
                }
            },
            "size": limit,
            "_source": True
        }
        
        # Execute the search
        response = es_client.search(
            index=Config.ES_PRODUCTS_INDEX,
            body=query
        )
        
        # Transform and return the results
        recommendations = [{**hit['_source'], 'id': hit['_id']} 
                         for hit in response['hits']['hits']
                         if hit['_id'] != product_id]  # Exclude the source product
        
        return {
            "results": recommendations,
            "total": len(recommendations)
        }
            
    except Exception as e:
        if "404" in str(e):
            raise HTTPException(status_code=404, detail="Product not found")
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")