'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Share2, ShoppingCart, Star, Truck } from "lucide-react"
import ProductCard from "@/components/product-card"
import { useParams } from 'next/navigation'
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

interface Product {
  id: string
  title: string
  price: number
  description: string
  condition: string
  category: string
  location: string
  seller: {
    name: string
    rating: number
    reviews: number
    joined: string
  }
  images: string[]
  features: string[]
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params?.id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      fetchProduct()
    }
  }, [params?.id])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity: 1,
      type: "buy"
    })
    
    toast.success("Added to cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} ${index + 2}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{product.condition}</Badge>
              <Badge variant="outline">{product.category}</Badge>
              <span className="text-muted-foreground text-sm">{product.location}</span>
            </div>
          </div>

          <div className="text-3xl font-bold">{formatPrice(product.price)}</div>

          <div className="flex gap-4">
            <Button className="flex-1 gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{product.seller.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-primary" />
                    <span className="ml-1">{product.seller.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{product.seller.reviews} reviews</span>
                  <span>•</span>
                  <span>Joined {product.seller.joined}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Contact
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Features</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be populated with related products */}
        </div>
      </div>
    </div>
  )
}

