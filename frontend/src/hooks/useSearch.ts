import { useSearchParams, useRouter } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
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

  return {
    query: searchParams.get('q') || '',
    page: parseInt(searchParams.get('page') || '1'),
    category: searchParams.get('category'),
    subcategory: searchParams.get('subcategory'),
    minPrice: searchParams.get('min_price'),
    maxPrice: searchParams.get('max_price'),
    minRating: searchParams.get('min_rating'),
    maxRating: searchParams.get('max_rating'),
    sort: searchParams.get('sort'),
    updateSearch,
  };
} 