'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="w-full bg-blue-700">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full h-12 text-lg pr-12"
        />
        <Button 
          type="submit" 
          size="icon"
          variant="ghost" 
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    )
}
