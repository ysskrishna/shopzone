'use client';

import { useSearch } from '@/hooks/useSearch';
import { Header } from '@/widgets/Header';
import { useEffect, useState } from 'react';
import { SearchResponse, Product } from '@/types';


export default function SearchPage() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const search = useSearch();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: search.query || '',
          page: search.page.toString(),
          ...(search.category && { category: search.category }),
          ...(search.subcategory && { subcategory: search.subcategory }),
          ...(search.minPrice && { min_price: search.minPrice }),
          ...(search.maxPrice && { max_price: search.maxPrice }),
          ...(search.minRating && { min_rating: search.minRating }),
          ...(search.maxRating && { max_rating: search.maxRating }),
          ...(search.sort && { sort: search.sort }),
        });

        const response = await fetch(`http://localhost:8005/search?${params.toString()}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
        // Handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [search.query, search.page, search.category, search.subcategory, 
      search.minPrice, search.maxPrice, search.minRating, search.maxRating, 
      search.sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        
        {results?.aggregations.categories.map(category => (
          <button
            key={category.key}
            onClick={() => search.updateSearch({ category: category.key })}
            className={`px-4 py-2 rounded ${
              search.category === category.key ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            {category.key} ({category.doc_count})
          </button>
        ))}
      </div>

      {/* Results Section */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p className="mb-4">
            Found {results?.total} results
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results?.results.map((product: Product, index: number) => (
              <div key={index} className="border p-4 rounded">
                {/* Product card content */}
                <h3>{product.name}</h3>
                <p>${product.discount_price}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {results && results.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: results.total_pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => search.updateSearch({ page: (i + 1).toString() })}
                  className={`px-4 py-2 rounded ${
                    search.page === i + 1 ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
