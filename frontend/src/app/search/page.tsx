'use client';

import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { Header } from '@/widgets/Header';
import { useEffect, useState } from 'react';
import { SearchResponse } from '@/types';
import { SearchResults } from "@/widgets/SearchResults";
import { SearchFilters } from "@/widgets/SearchFilters";

export default function SearchPage() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const search = useSearch();

  useEffect(() => {
    const fetchResults = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('q', search.query || '');
        params.set('page', search.page.toString());
        
        // Handle multiple categories and subcategories
        search.category.forEach(cat => params.append('category', cat));
        search.subcategory.forEach(subcat => params.append('subcategory', subcat));
        
        // Add other params
        if (search.minPrice) params.set('min_price', search.minPrice);
        if (search.maxPrice) params.set('max_price', search.maxPrice);
        if (search.minRating) params.set('min_rating', search.minRating);
        if (search.maxRating) params.set('max_rating', search.maxRating);
        if (search.sort) params.set('sort', search.sort);
        if (search.limit) params.set('limit', search.limit.toString());

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

    if (search.query && search.query.length >= 3) {
      fetchResults();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <SearchFilters results={results} />
          </div>
          <div className="md:col-span-3">
            <SearchResults results={results} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
