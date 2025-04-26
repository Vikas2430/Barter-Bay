"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, SlidersHorizontal } from "lucide-react"
import ProductCard from "@/components/product-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSearchParams, useRouter } from "next/navigation"
import { SearchDropdown } from "@/components/search-dropdown"

// Mock products data with categories
const mockProducts = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=300",
    seller: "john_doe",
    condition: "Good",
    category: "Clothing",
    description: "A classic vintage leather jacket in excellent condition.",
  },
  {
    id: "2",
    title: "iPhone 12 Pro",
    price: 499.99,
    image: "/placeholder.svg?height=200&width=300",
    seller: "tech_reseller",
    condition: "Like New",
    category: "Electronics",
    description: "iPhone 12 Pro in pristine condition, includes original box and accessories.",
  },
  {
    id: "3",
    title: "Antique Wooden Chair",
    price: 120,
    image: "/placeholder.svg?height=200&width=300",
    seller: "vintage_finds",
    condition: "Used",
    category: "Furniture",
    description: "Beautiful antique wooden chair with intricate carvings.",
  },
  {
    id: "4",
    title: "Mountain Bike",
    price: 350,
    image: "/big-shoe2.png",
    seller: "outdoor_enthusiast",
    condition: "Good",
    category: "Sports",
    description: "High-quality mountain bike suitable for trails and adventures.",
  },
  {
    id: "5",
    title: "Canon EOS 5D Mark IV",
    price: 1200,
    image: "/placeholder.svg?height=200&width=300",
    seller: "photo_pro",
    condition: "Like New",
    category: "Electronics",
    description: "Professional DSLR camera with excellent image quality.",
  },
  {
    id: "6",
    title: "Vintage Vinyl Records Collection",
    price: 150,
    image: "/placeholder.svg?height=200&width=300",
    seller: "music_lover",
    condition: "Good",
    category: "Collectibles",
    description: "Collection of classic vinyl records from the 70s and 80s.",
  },
  {
    id: "7",
    title: "Handmade Ceramic Vase",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    seller: "craft_artisan",
    condition: "New",
    category: "Collectibles",
    description: "Beautiful handmade ceramic vase with unique patterns.",
  },
  {
    id: "8",
    title: "Gaming Laptop",
    price: 850,
    image: "/placeholder.svg?height=200&width=300",
    seller: "gamer_zone",
    condition: "Used",
    category: "Electronics",
    description: "Powerful gaming laptop with high-performance graphics.",
  },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [realListings, setRealListings] = useState<any[]>([])
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState("newest")

  // Fetch real listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings')
        if (!response.ok) throw new Error('Failed to fetch listings')
        const data = await response.json()
        if (data.success) {
          // Transform real listings to match the format of dummy products
          const transformedListings = data.data.listings.map((listing: any) => ({
            id: listing._id,
            title: listing.title,
            price: listing.price,
            image: listing.images && listing.images.length > 0 
              ? `data:${listing.images[0].contentType};base64,${listing.images[0].data}`
              : "/placeholder.svg",
            seller: listing.seller.username,
            condition: listing.condition,
            category: listing.category,
            description: listing.description
          }))
          setRealListings(transformedListings)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
      }
    }
    fetchListings()
  }, [])

  // Initialize search query from URL
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search")
      if (search) {
        setSearchQuery(search)
      }
    }
  }, [searchParams])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const allProducts = [...mockProducts, ...realListings]
    return allProducts
      .filter((product) => {
        // Search filter - check both title and description
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        
        // Category filter
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
        
        // Condition filter
        const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition)
        
        // Price range filter
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

        return matchesSearch && matchesCategory && matchesCondition && matchesPrice
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "newest":
            return b.id.localeCompare(a.id) // Using ID as a proxy for date
          default:
            return 0
        }
      })
  }, [searchQuery, selectedCategories, selectedConditions, priceRange, sortBy, realListings])

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  // Handle condition selection
  const handleConditionChange = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    )
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Showing {filteredProducts.length} results</p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <SearchDropdown products={mockProducts} />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-6 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="space-y-3">
                    {["Electronics", "Furniture", "Clothing", "Books", "Sports", "Collectibles"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Condition</h3>
                  <div className="space-y-3">
                    {["New", "Like New", "Good", "Used", "For parts"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`condition-${condition}`}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => handleConditionChange(condition)}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <Slider 
                    defaultValue={priceRange} 
                    min={0} 
                    max={2000} 
                    step={10}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">₹{priceRange[0]}</span>
                    <span className="text-sm text-muted-foreground">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-[250px] shrink-0">
          <div className="sticky top-24 grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-3">
                {["Electronics", "Furniture", "Clothing", "Books", "Sports", "Collectibles"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`desktop-category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={`desktop-category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Condition</h3>
              <div className="space-y-3">
                {["New", "Like New", "Good", "Used", "For parts"].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`desktop-condition-${condition}`}
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionChange(condition)}
                    />
                    <label
                      htmlFor={`desktop-condition-${condition}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Price Range</h3>
              <Slider 
                defaultValue={priceRange} 
                min={0} 
                max={2000} 
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">₹{priceRange[0]}</span>
                <span className="text-sm text-muted-foreground">₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                seller={product.seller}
                condition={product.condition}
                description={product.description}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products match your search criteria</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="mx-auto">
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

