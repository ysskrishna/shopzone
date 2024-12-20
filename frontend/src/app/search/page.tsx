import { SearchBar } from "@/widgets/SearchBar"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ShopZone</h1>
            <div className="w-full max-w-xl mx-4">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        some products
        {/* <div className="grid grid-cols-4 gap-8">
          <SearchFilters />
          <div className="col-span-3">
            <SearchResults query={searchParams.q} />
          </div>
        </div> */}
      </main>
    </div>
  )
}

