"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  seller: string
  condition: string
  description?: string
}

export default function ProductCard({ id, title, price, image, seller, condition, description = "" }: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    // Check if product is in wishlist on component mount
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsInWishlist(wishlist.some((item: any) => item.id === id))
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }, [id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      
      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((item: any) => item.id !== id)
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
        setIsInWishlist(false)
      } else {
        // Add to wishlist
        const product = { id, title, price, image, description }
        wishlist.push(product)
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id,
      name: title,
      price,
      image,
      quantity: 1,
      type: "buy"
    })
    
    toast.success("Added to cart")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${id}`}>
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 rounded-full hover:bg-black ${isInWishlist ? 'text-red-500' : ''}`}
            onClick={toggleWishlist}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
          <Badge className="absolute bottom-2 left-2">{condition}</Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{formatPrice(price)}</span>
        </div>
        <p className="text-muted-foreground text-sm">by {seller}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="w-full" variant="outline" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

