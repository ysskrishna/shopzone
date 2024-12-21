import { useSearchParams, useRouter } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        // Delete existing values first
        params.delete(key);
        // Add each value
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });

    // Reset page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      params.set('page', '1');
    }

    router.push(`/search?${params.toString()}`);
  };

  // Get both categories and subcategories as arrays
  const category = searchParams.getAll('category');
  const subcategory = searchParams.getAll('subcategory');
  const limit = searchParams.get('limit') || '10';

  return {
    query: searchParams.get('q') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(limit),
    category,
    subcategory,
    minPrice: searchParams.get('min_price'),
    maxPrice: searchParams.get('max_price'),
    minRating: searchParams.get('min_rating'),
    maxRating: searchParams.get('max_rating'),
    sort: searchParams.get('sort'),
    updateSearch,
    clearFilters: () => {
      const params = new URLSearchParams();
      params.set('q', searchParams.get('q') || '');
      params.set('page', '1');
      params.set('limit', limit);
      router.push(`/search?${params.toString()}`);
    }
  };
} 