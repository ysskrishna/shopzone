import { Aggregations } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FiltersProps {
  aggregations: Aggregations | undefined;
  filters: {
    mainCategory: string;
    subCategory: string;
    priceRange: [number, number];
    ratingRange: [number, number];
  };
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps['filters']>>;
}

export default function Filters({
  aggregations,
  filters,
  setFilters,
}: FiltersProps) {
  if (!aggregations) return null;

  return (
    <div className="w-64 mr-8">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Main Categories</h3>
        {aggregations.main_categories.map((category) => (
          <div key={category.key} className="flex items-center mb-2">
            <Checkbox
              id={`main-${category.key}`}
              checked={filters.mainCategory === category.key}
              onCheckedChange={() =>
                setFilters((prev) => ({ ...prev, mainCategory: category.key }))
              }
            />
            <Label htmlFor={`main-${category.key}`} className="ml-2">
              {category.key} ({category.doc_count})
            </Label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sub Categories</h3>
        {aggregations.sub_categories.map((category) => (
          <div key={category.key} className="flex items-center mb-2">
            <Checkbox
              id={`sub-${category.key}`}
              checked={filters.subCategory === category.key}
              onCheckedChange={() =>
                setFilters((prev) => ({ ...prev, subCategory: category.key }))
              }
            />
            <Label htmlFor={`sub-${category.key}`} className="ml-2">
              {category.key} ({category.doc_count})
            </Label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          min={aggregations.price_stats.min}
          max={aggregations.price_stats.max}
          step={100}
          value={filters.priceRange}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: value as [number, number],
            }))
          }
        />
        <div className="flex justify-between mt-2">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Rating</h3>
        {aggregations.rating_ranges.map((range) => (
          <div key={range.key} className="flex items-center mb-2">
            <Checkbox
              id={`rating-${range.key}`}
              checked={
                filters.ratingRange[0] === range.from &&
                filters.ratingRange[1] === range.to
              }
              onCheckedChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  ratingRange: [range.from || 0, range.to || 5],
                }))
              }
            />
            <Label htmlFor={`rating-${range.key}`} className="ml-2">
              {range.key.replace('*', '∞')} ({range.doc_count})
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
