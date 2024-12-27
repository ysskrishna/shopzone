'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 shrink-0">
              Shopzone
            </h1>
          </Link>
          <div className="w-full mt-3 sm:mt-0 sm:w-full sm:ml-3">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
