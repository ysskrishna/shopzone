'use client'

import { X, Tag, Layers, DollarSign, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useSearch } from '@/hooks/useSearch'


export function ActiveFilters() {
  const search = useSearch()
  const filters = search.getFilters()

  const hasActiveFilters = 
    (filters.category && filters.category.length > 0) ||
    (filters.subcategory && filters.subcategory.length > 0) ||
    (filters.minPrice && filters.minPrice !== null) ||
    (filters.maxPrice && filters.maxPrice !== null) ||
    (filters.minRating && filters.minRating !== null) ||
    (filters.maxRating && filters.maxRating !== null);

  if (!hasActiveFilters) {
    return null;
  }

  const onRemoveCategory = (category: string) => {
    search.updateSearch({ category: search.category.filter(c => c !== category), page: '1' });
  };

  const onRemoveSubcategory = (subcategory: string) => {
    search.updateSearch({ subcategory: search.subcategory.filter(s => s !== subcategory), page: '1' });
  };

  const onRemovePrice = () => {
    search.updateSearch({min_price: null, max_price: null, page: '1'});
  };

  const onRemoveRating = () => {
    search.updateSearch({min_rating: null, max_rating: null, page: '1'});
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.category?.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
        >
          <Tag className="h-3 w-3" />
          {category}
          <button
            onClick={() => onRemoveCategory(category)}
            className="ml-1 hover:bg-gray-300 rounded p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {category} filter</span>
          </button>
        </Badge>
      ))}

      {filters.subcategory?.map((subcategory) => (
        <Badge
          key={subcategory}
          variant="secondary"
          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
        >
          <Layers className="h-3 w-3" />
          {subcategory}
          <button
            onClick={() => onRemoveSubcategory(subcategory)}
            className="ml-1 hover:bg-gray-300 rounded p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {subcategory} filter</span>
          </button>
        </Badge>
      ))}

      {filters.minPrice && filters.maxPrice && (
        <Badge
          variant="secondary"
          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
        >
          <DollarSign className="h-3 w-3" />
          Price: ₹{filters.minPrice} - ₹{filters.maxPrice}
          <button
            onClick={onRemovePrice}
            className="ml-1 hover:bg-gray-300 rounded p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove price range filter</span>
          </button>
        </Badge>
      )}

      {filters.minRating && filters.maxRating && (
        <Badge
          variant="secondary"
          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
        >
          <Star className="h-3 w-3" />
          Rating: {filters.minRating} - {filters.maxRating}
          <button
            onClick={onRemoveRating}
            className="ml-1 hover:bg-gray-300 rounded p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove rating range filter</span>
          </button>
        </Badge>
      )}

      <Badge
        variant="secondary"
        className="pl-2 pr-1 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
        onClick={search.clearFilters}
      >
        Clear All Filters
      </Badge>
    </div>
  )
}