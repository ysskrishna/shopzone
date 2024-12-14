import { Product, SearchResult } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

interface ProductListProps {
  results: SearchResult[]
}

export default function ProductList({ results }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
      {results.map(({_id, _source: product}) => (
        <Card key={_id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm h-12 overflow-hidden">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative h-48 mb-2">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">₹{product.discount_price}</span>
              {product.discount_price < product.actual_price && (
                <span className="text-sm line-through text-gray-500">₹{product.actual_price}</span>
              )}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{product.ratings.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({product.no_of_ratings})</span>
            </div>
          </CardContent>
          <CardFooter>
            <Badge variant="secondary">{product.main_category}</Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

