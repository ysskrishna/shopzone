import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import config from '@/common/config';
import { Header } from '@/widgets/Header';
import Image from 'next/image';
import { Star } from 'lucide-react';
import BackButton from '@/widgets/BackButton';
import { ProductCard } from '@/widgets/ProductCard';
import { Product } from '@/types';

const fetchProduct = async (productId: string) => {
    const response = await fetch(`${config.baseUrl}/product/${productId}`, {
        next: { revalidate: 60 }, // Cache for 1 minute
    });
  
    if (!response.ok) {
        notFound();
    }
    
    return response.json();
}

const fetchRecommendations = async (productId: string) => {
    const response = await fetch(`${config.baseUrl}/product/${productId}/recommendations?limit=8`, {
        next: { revalidate: 60 }, // Cache for 1 minute
    });
    if (!response.ok) {
        return [];
    }
    const data = await response.json();
    return data?.results || [];
}


export async function generateMetadata(
  { params }: { params: { productId: string } }
): Promise<Metadata> {
  const validatedParams = await Promise.resolve(params);
  const product = await fetchProduct(validatedParams.productId);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description
    },
  };
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  // Await params here as well
  const validatedParams = await Promise.resolve(params);
  const product = await fetchProduct(validatedParams.productId);
  const recommendations = await fetchRecommendations(validatedParams.productId);  


  const discountPercentage = Math.round(
    ((product.actual_price - product.discount_price) / product.actual_price) * 100
  )
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
            <BackButton />
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-1/3 mb-8 md:mb-0 ">
                <div className="relative w-full h-[320px] overflow-hidden rounded-lg">
                    <Image
                    src={product.image}
                    alt={product.name}
                    width={320}
                    height={320}
                    className="object-contain absolute inset-0 w-full h-full"
                    />
                </div>

                </div>
                <div className="md:w-2/3">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                        {product.ratings.toFixed(1)} ({product.no_of_ratings.toLocaleString()} reviews)
                    </span>
                    </div>
                </div>
                <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">₹{product.discount_price.toLocaleString()}</span>
                    {product.discount_price < product.actual_price && (
                    <>
                        <span className="ml-2 text-lg text-gray-500 line-through">
                        ₹{product.actual_price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                        Save {discountPercentage}%
                        </span>
                    </>
                    )}
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Product Details</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Category: {product.main_category}</li>
                        <li>Sub-category: {product.sub_category}</li>
                        <li>ASIN: {product.asin}</li>
                    </ul>
                </div>
                </div>
            </div>

            


            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((item: Product) => (
                    <ProductCard key={item.id} product={item} />
                ))}
                </div>
            </div>
        </div>
    </div>
  );
} 