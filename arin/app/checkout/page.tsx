"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface UserProfile {
  name: string
  address: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        if (data.success) {
          setProfile(data.data.profile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [isLoggedIn, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handlePlaceOrder = async () => {
    if (!profile?.address) {
      toast.error("Please update your delivery address in your profile")
      router.push('/profile')
      return
    }

    setIsPlacingOrder(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Transform cart items to match backend format
      const transformedItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
        image: item.image
      }))

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: transformedItems,
          totalAmount: subtotal,
          deliveryAddress: profile.address
        })
      })

      // Debug: Log the raw response
      const responseText = await response.text()
      console.log('Raw server response:', responseText)

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || 'Failed to place order')
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          throw new Error('Server returned an invalid response')
        }
      }

      try {
        const data = JSON.parse(responseText)
        if (data.success) {
          clearCart()
          toast.success('Order placed successfully!')
          router.push('/orders')
        } else {
          throw new Error(data.error || 'Failed to place order')
        }
      } catch (parseError) {
        console.error('Error parsing success response:', parseError)
        throw new Error('Server returned an invalid response')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!isLoggedIn || isLoading) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p className="text-muted-foreground">{profile?.name || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">{profile?.address || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type === "buy" ? "Buy" : "Rent"} - Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Estimated Delivery Time</h3>
                  <p className="text-muted-foreground">3-5 business days</p>
                </div>
                <div>
                  <h3 className="font-medium">Shipping Method</h3>
                  <p className="text-muted-foreground">Standard Delivery</p>
                </div>
                <div>
                  <h3 className="font-medium">Tracking Information</h3>
                  <p className="text-muted-foreground">Will be provided after order confirmation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  )
} 