"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  title: string
  price: number
  image: string
}

interface SearchDropdownProps {
  products: Product[]
}

export function SearchDropdown({ products }: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5)) // Show only top 5 matches
    } else {
      // When no search query, show all products (up to 5)
      setSuggestions(products.slice(0, 5))
    }
  }, [searchQuery, products])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    // When focusing, show all products if there's no search query
    if (!searchQuery.trim()) {
      setSuggestions(products.slice(0, 5))
    }
  }

  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setIsOpen(false)
  }

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price * 75) // Convert USD to INR (assuming 1 USD = 75 INR)
  }

  return (
    <div className="relative flex-1 md:w-[300px]" ref={dropdownRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
      </form>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => handleSuggestionClick(product.id)}
                >
                  <span className="text-sm text-black font-medium">{product.title}</span>
                  <span className="text-sm text-black">{formatPrice(product.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-black">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  )
} 