import { Header } from '@/widgets/Header';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
  );
}
