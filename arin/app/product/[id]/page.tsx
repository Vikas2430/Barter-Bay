'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { WishlistIcon } from '@/components/wishlist-icon'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params?.id])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!product) {
    return <div className="container mx-auto p-4">Product not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button>Add to Cart</Button>
            <WishlistIcon productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
} 