export interface Product {
  id: string;
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  link: string;
  ratings: number;
  no_of_ratings: number;
  discount_price: number;
  actual_price: number;
  asin: string;
}

export interface BucketAggregation {
  key: string;
  doc_count: number;
}

export interface StatsAggregation {
  min: number;
  max: number;
  avg: number;
}

export interface Aggregations {
  categories: Array<BucketAggregation>;
  subcategories: Array<BucketAggregation>;
  price_stats: StatsAggregation;
  rating_stats: StatsAggregation;
}

export interface SearchResponse {
  results: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  aggregations: Aggregations;
}
