'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WishlistIconProps {
  productId: string
}

export function WishlistIcon({ productId }: WishlistIconProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch('/api/wishlist')
        if (!response.ok) throw new Error('Failed to fetch wishlist')
        const data = await response.json()
        setIsWishlisted(data.some((item: any) => item.productId === productId))
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()
  }, [productId])

  const toggleWishlist = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) throw new Error('Failed to update wishlist')
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Error updating wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWishlist}
      disabled={loading}
      className={isWishlisted ? 'text-red-500' : 'text-gray-500'}
    >
      <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
    </Button>
  )
} 