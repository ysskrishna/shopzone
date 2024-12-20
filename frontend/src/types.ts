export interface Product {
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

export interface Aggregations {
  categories: Array<{ key: string; doc_count: number }>;
  subcategories: Array<{ key: string; doc_count: number }>;
  price_stats: { min: number; max: number; avg: number };
  rating_stats: { min: number; max: number; avg: number };
}

export interface SearchResponse {
  results: Product[];
  total: number;
  page: number;
  total_pages: number;
  aggregations: Aggregations;
}
