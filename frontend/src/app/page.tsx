'use client'

import Link from "next/link"
import { SearchBar } from "@/widgets/SearchBar"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-5xl text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-900">
          Welcome to ShopZone
        </h1>
        <p className="text-xl text-gray-600">
          Discover millions of products at the best prices
        </p>
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          {["Electronics", "Fashion", "Home", "Beauty"].map((category) => (
            <Link
              key={category}
              href={`/search?q=${category.toLowerCase()}`}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold">{category}</h2>
              <p className="text-sm text-gray-500">Shop Now →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}