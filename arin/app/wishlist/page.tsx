"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  price: number
  image: string
  description: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const router = useRouter()
  const { addItem } = useCart()

  useEffect(() => {
    // Get wishlist items from localStorage
    const storedWishlist = localStorage.getItem('wishlist')
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist))
    }
  }, [])

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      type: "buy"
    })
    
    toast.success("Added to cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 rounded-full hover:bg-white"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h2 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h2>
                <p className="text-primary font-bold">₹{product.price.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 