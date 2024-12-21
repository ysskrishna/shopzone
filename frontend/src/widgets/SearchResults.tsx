'use client'

import { useSearch } from '@/hooks/useSearch';
import { SearchResponse } from '@/types';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

interface SearchResultsProps {
  results: SearchResponse | null;
  loading: boolean;
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  const search = useSearch();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!results) {
    return null;
  }

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Showing {((results.page - 1) * results.limit) + 1} - {Math.min(results.page * results.limit, results.total)} of {results.total} results
          {search.query && ` for "${search.query}"`}
        </h2>
        <div className="flex items-center space-x-4">
          <Select 
            value={results.limit.toString()} 
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={search.sort || "relevance"} 
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.results.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="relative w-full h-[320px] overflow-hidden rounded-lg mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={320}
                  className="object-contain absolute inset-0 w-full h-full"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
                {product.name}
              </h3>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {product.ratings.toFixed(1)} ({product.no_of_ratings})
                </span>
              </div>
              <div>
                <span className="text-lg font-bold">₹{product.discount_price.toFixed(2)}</span>
                {product.actual_price > product.discount_price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{product.actual_price.toFixed(2)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(results.page - 1)}
                disabled={results.page === 1}
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
                disabled={results.page === results.total_pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

