export interface Product {
    name: string
    main_category: string
    sub_category: string
    image: string
    link: string
    ratings: number
    no_of_ratings: number
    discount_price: number
    actual_price: number
    asin: string
  }
  
  export interface SearchResult {
    _index: string
    _type: string
    _id: string
    _score: number
    _source: Product
  }
  
  export interface Aggregations {
    main_categories: Array<{ key: string; doc_count: number }>
    sub_categories: Array<{ key: string; doc_count: number }>
    price_stats: {
      count: number
      min: number
      max: number
      avg: number
      sum: number
    }
    rating_stats: {
      count: number
      min: number
      max: number
      avg: number
      sum: number
    }
    rating_ranges: Array<{
      key: string
      from?: number
      to?: number
      doc_count: number
    }>
  }
  
  export interface SearchResponse {
    results: SearchResult[]
    total: number
    aggregations: Aggregations
  }  