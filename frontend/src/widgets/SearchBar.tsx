'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';

export function SearchBar() {
  const search = useSearch();
  const [query, setQuery] = useState(search.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search.updateSearch({ q: query.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full h-12 text-lg pr-12"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
