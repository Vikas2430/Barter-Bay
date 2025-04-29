"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Seller {
  id?: string
  name: string
  rating?: number
}

interface Product {
  id: string
  title: string
  price: number
  image: string
  seller: string | Seller
  condition: string
  description: string
}

export default function CategoryPage() {
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products?category=${params.category}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        // Ensure the data is properly formatted
        const formattedProducts = data.map((product: any) => ({
          id: product.id || product._id,
          title: product.title || '',
          price: typeof product.price === 'number' ? product.price : 0,
          image: product.image || '/placeholder.svg',
          seller: typeof product.seller === 'object' ? product.seller.name : (product.seller || 'Unknown'),
          condition: product.condition || 'Used',
          description: product.description || ''
        }))
        setProducts(formattedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.category) {
      fetchProducts()
    }
  }, [params.category])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold capitalize">{params.category}</h1>
      </div>

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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              seller={typeof product.seller === 'string' ? product.seller : product.seller.name}
              condition={product.condition}
              description={product.description}
            />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  )
} 