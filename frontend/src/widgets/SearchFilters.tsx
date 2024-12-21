'use client'

import { useSearch } from '@/hooks/useSearch'
import { SearchResponse } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { MultiRangeSlider } from '@/components/ui/multi-range-slider'
import { useCallback } from 'react'

interface SearchFiltersProps {
  results: SearchResponse | null
}

export function SearchFilters({ results }: SearchFiltersProps) {
  const search = useSearch()

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...search.category, category]
      : search.category.filter(c => c !== category)
    
    search.updateSearch({ 
      category: newCategories,
      page: '1'
    })
  }

  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    const newSubcategories = checked
      ? [...search.subcategory, subcategory]
      : search.subcategory.filter(s => s !== subcategory)
    
    search.updateSearch({ 
      subcategory: newSubcategories,
      page: '1'
    })
  }

  const handlePriceChange = useCallback((range: { min: number; max: number }) => {
    search.updateSearch({
      min_price: range.min.toString(),
      max_price: range.max.toString(),
      page: '1'
    })
  }, [search])

  const handleRatingChange = useCallback((range: { min: number; max: number }) => {
    search.updateSearch({
      min_rating: range.min.toString(),
      max_rating: range.max.toString(),
      page: '1'
    })
  }, [search])

  const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`
  const formatRating = (value: number) => `${value.toFixed(1)}★`

  if (!results?.aggregations) {
    return <div>Loading filters...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {results.aggregations.categories.map((category: any) => (
              <div key={category.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.key}`}
                  checked={search.category.includes(category.key)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.key, checked as boolean)
                  }
                />
                <Label htmlFor={`category-${category.key}`}>
                  {category.key} ({category.doc_count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Subcategories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.aggregations.subcategories.map((subcategory: any) => (
              <div key={subcategory.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={`subcategory-${subcategory.key}`}
                  checked={search.subcategory.includes(subcategory.key)}
                  onCheckedChange={(checked) => 
                    handleSubcategoryChange(subcategory.key, checked as boolean)
                  }
                />
                <Label htmlFor={`subcategory-${subcategory.key}`}>
                  {subcategory.key} ({subcategory.doc_count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Price Range</h4>
          <MultiRangeSlider
            min={results.aggregations.price_stats.min}
            max={results.aggregations.price_stats.max}
            // onChange={handlePriceChange}
            onChange={() => console.log("Price changed")}
            step={100}
            formatValue={formatPrice}
          />
        </div>

        {/* Rating Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Rating</h4>
          <MultiRangeSlider
            min={results.aggregations.rating_stats.min}
            max={results.aggregations.rating_stats.max}
            // onChange={handleRatingChange}
            onChange={() => console.log("Rating changed")}
            step={0.5}
            formatValue={formatRating}
          />
        </div>
      </div>
    </div>
  )
}
