'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductList from '@/widgets/ProductList';
import Filters from '@/widgets/Filters';
import { SearchResponse } from '../types';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [filters, setFilters] = useState({
    mainCategory: '',
    subCategory: '',
    priceRange: [0, 100000],
    ratingRange: [0, 5],
  });

  useEffect(() => {
    // In a real application, this would be an API call to your Elasticsearch backend
    const fetchSearchResults = async () => {
      // Simulating API call with the provided data
      const body = {
        name: 'lloyd',
      };
      const response = await fetch('http://localhost:8005/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setSearchResults(data);
    };

    fetchSearchResults();
  }, [searchTerm, filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Search</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Button onClick={() => {}}>Search</Button>
      </div>
      <div className="flex">
        <Filters
          aggregations={searchResults?.aggregations}
          filters={filters}
          setFilters={setFilters}
        />
        <ProductList results={searchResults?.results || []} />
      </div>
    </div>
  );
}
