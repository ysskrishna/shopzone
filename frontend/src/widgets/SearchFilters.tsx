'use client'

import { useSearch } from '@/hooks/useSearch'
import { SearchResponse } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import MultiRangeSlider from './MultiRangeSlider'
import { Tag, Layers, DollarSign, Star } from 'lucide-react'
import { BucketAggregation } from '@/types'

interface SearchFiltersProps {
  results: SearchResponse
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

  const handlePriceChange = (range: { min: number; max: number }) => {
    search.updateSearch({
      min_price: range.min.toString(),
      max_price: range.max.toString(),
      page: '1'
    });
  }

  const handleRatingChange = (range: { min: number; max: number }) => {
    search.updateSearch({
      min_rating: range.min.toString(),
      max_rating: range.max.toString(),
      page: '1'
    });
  }

  const formatPrice = (value: number) => `₹${value}`
  const formatRating = (value: number) => `${value.toFixed(1)}★`

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </h4>
          <div className="space-y-2">
            {results.aggregations.categories.map((category: BucketAggregation) => (
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
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Subcategories
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.aggregations.subcategories.map((subcategory: BucketAggregation) => (
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
        <div className="mb-6">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price
          </h4>
          <MultiRangeSlider
            min={Math.floor(results.aggregations.price_stats.min / 100) * 100}
            max={Math.ceil(results.aggregations.price_stats.max / 100) * 100}
            step={100}
            onSubmit={handlePriceChange}
            formatValue={formatPrice}
          />
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Deals & Discounts
          </h4>
          <MultiRangeSlider
            min={results.aggregations.rating_stats.min}
            max={results.aggregations.rating_stats.max}
            step={1}
            onSubmit={handleRatingChange}
            formatValue={formatRating}
          />
        </div>
      </div>
    </div>
  )
}
