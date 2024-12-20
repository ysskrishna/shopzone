'use client'

import { SearchBar } from "./SearchBar"


export function Header() {
    return (
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
    )
}
