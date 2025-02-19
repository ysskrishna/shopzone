'use client'

import { useSearch } from '@/hooks/useSearch';
import { SearchResponse } from '@/types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ActiveFilters } from '@/widgets/ActiveFilters';
import { ProductCard } from './ProductCard';

interface SearchResultsProps {
  results: SearchResponse;
}

export function SearchResults({ results }: SearchResultsProps) {
  const search = useSearch();

  const handlePageChange = (newPage: number) => {
    search.updateSearch({ page: newPage.toString() });
  };

  const handleItemsPerPageChange = (value: string) => {
    search.updateSearch({ 
      limit: value,
      page: '1'
    });
  };

  const handleSortChange = (value: string) => {
    search.updateSearch({ sort: value });
  };

  const renderPaginationItems = (maxVisiblePages: number=5) => {
    const items = [];
    const totalPages = results.total_pages;
    const currentPage = results.page;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Complex pagination logic for many pages
      const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);

      if (leftBound > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
          </PaginationItem>
        );
        if (leftBound > 2) {
          items.push(<PaginationEllipsis key="leftEllipsis" />);
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          items.push(<PaginationEllipsis key="rightEllipsis" />);
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div>
      <div className="mb-4">
        <ActiveFilters />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
        <h2 className="text-lg font-semibold">
          Showing {((results.page - 1) * results.limit) + 1} - {Math.min(results.page * results.limit, results.total)} of {results.total} results
          {search.query && ` for "${search.query}"`}
        </h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Select 
            value={search.sort || "relevance"} 
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Select 
          value={results.limit.toString()} 
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(results.page - 1)}
                isActive={results.page > 1}
              />
            </PaginationItem>
            <span className='flex sm:hidden'>
              {renderPaginationItems(2)}
            </span>
            <span className='hidden sm:flex'>
              {renderPaginationItems(5)}
            </span>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(results.page + 1)}
                isActive={results.page < results.total_pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

