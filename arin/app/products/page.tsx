"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, SlidersHorizontal, Upload } from "lucide-react"
import ProductCard from "@/components/product-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSearchParams, useRouter } from "next/navigation"
import { SearchDropdown } from "@/components/search-dropdown"

// Mock products data with categories
const mockProducts = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 6749,
    image: "/Vintage Leather jacket.jpg",
    seller: "John Doe",
    condition: "Good",
    category: "Clothing",
    description: "This authentic vintage leather jacket features a classic design with a comfortable fit. Made from genuine leather, it offers durability and style that will last for years. The jacket includes two front pockets, a full-length zipper, and adjustable cuffs.",
  },
  {
    id: "2",
    title: "iPhone 12 Pro",
    price: 37499,
    image: "/iphone.jpg",
    seller: "Tech Reseller",
    condition: "Like New",
    category: "Electronics",
    description: "iPhone 12 Pro in excellent condition. Includes charger and original box.",
  },
  {
    id: "3",
    title: "Antique Wooden Chair",
    price: 9000,
    image: "/antique chair.jpg",
    seller: "Vintage Finds",
    condition: "Used",
    category: "Furniture",
    description: "Beautiful antique wooden chair with intricate carvings. A perfect addition to any vintage collection.",
  },
  {
    id: "4",
    title: "Mountain Bike",
    price: 26250,
    image: "/Mountain Bike.jpg",
    seller: "Outdoor Enthusiast",
    condition: "Good",
    category: "Sports",
    description: "High-quality mountain bike suitable for trails and adventures. Perfect for outdoor enthusiasts.",
  },
  {
    id: "5",
    title: "Gaming Laptop",
    price: 63750,
    image: "/gaming.jpeg",
    seller: "Gaming Gear",
    condition: "Like New",
    category: "Electronics",
    description: "High-performance gaming laptop with the latest graphics card and processor. Perfect for gaming and content creation.",
  },
  {
    id: "6",
    title: "Handmade Ceramic Vase",
    price: 3375,
    image: "/vase.jpg",
    seller: "Artisan Crafts",
    condition: "New",
    category: "Home Decor",
    description: "Beautiful handmade ceramic vase with unique patterns. A perfect decorative piece for your home.",
  },
  {
    id: "7",
    title: "Vintage Vinyl Records Collection",
    price: 11250,
    image: "/vinyl collection.jpeg",
    seller: "Vinyl Collector",
    condition: "Good",
    category: "Collectibles",
    description: "Rare collection of vintage vinyl records from the 70s and 80s. Includes classic albums in excellent condition.",
  },
  {
    id: "8",
    title: "Canon EOS 5D Mark IV",
    price: 90000,
    image: "/Canon5DIV_hero3_4000-1920x1266.jpg",
    seller: "Pro Photography",
    condition: "Like New",
    category: "Electronics",
    description: "Professional-grade DSLR camera with 30.4MP full-frame sensor. Perfect for professional photography.",
  },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [realListings, setRealListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortBy, setSortBy] = useState("newest")

  // Fetch real listings
  const fetchListings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching listings...')

      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }

      const data = await response.json()

      if (!data.success || !data.data?.listings) {
        throw new Error('Invalid response format from server')
      }

      // Filter out rental listings and transform sale listings to match dummy products format
      const saleListings = data.data.listings
        .filter((listing: any) => listing.type === 'sale' || !listing.type)
        .map((listing: any) => ({
          id: listing._id,
          title: listing.title,
          price: typeof listing.price === 'number' ? listing.price : (listing.price?.amount || 0),
          image: listing.images && listing.images.length > 0 
            ? `data:${listing.images[0].contentType};base64,${listing.images[0].data}`
            : "/placeholder.svg",
          seller: listing.seller?.username || 'Unknown',
          condition: listing.condition || 'Used',
          category: listing.category || 'Other',
          description: listing.description || 'No description available',
          createdAt: listing.createdAt,
          isRealListing: true
        }))
      
      setRealListings(saleListings)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setError('Failed to load listings. Please try again later.')
      setRealListings([])
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
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
    // Combine dummy products with real listings
    const allProducts = [...mockProducts, ...realListings]
    return allProducts
      .filter((product) => {
        // Search filter - check both title and description
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) || 
          (product.description && product.description.toLowerCase().includes(searchLower))
        
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
            // For real listings, use createdAt if available
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            // For dummy products, use ID as a proxy for date
            return b.id.localeCompare(a.id)
          default:
            return 0
        }
      })
  }, [searchQuery, selectedCategories, selectedConditions, priceRange, sortBy, realListings])

  // Get unique categories from both real and dummy products
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    mockProducts.forEach(product => categories.add(product.category))
    realListings.forEach(listing => categories.add(listing.category))
    return Array.from(categories)
  }, [realListings])

  // Get unique conditions from both real and dummy products
  const uniqueConditions = useMemo(() => {
    const conditions = new Set<string>()
    mockProducts.forEach(product => conditions.add(product.condition))
    realListings.forEach(listing => conditions.add(listing.condition))
    return Array.from(conditions)
  }, [realListings])

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
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchListings()}
            disabled={isLoading}
          >
            <Upload className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

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
                    {uniqueCategories.map((category) => (
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
                    {uniqueConditions.map((condition) => (
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
                    max={100000}
                    step={1000}
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
                {uniqueCategories.map((category) => (
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
                {uniqueConditions.map((condition) => (
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
                max={100000}
                step={1000}
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
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
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

