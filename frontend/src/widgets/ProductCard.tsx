'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getProductUrl } from '@/common/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    
    <Link 
        href={getProductUrl(product)}
        key={product.id}
    >
        <Card>
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
    </Link>
  );
}
