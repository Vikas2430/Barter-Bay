"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  type: 'buy' | 'rent'
  image: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  deliveryAddress: string
  orderDate: string
  estimatedDelivery: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        if (data.success) {
          setOrders(data.data.orders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load order history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [isLoggedIn, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isLoggedIn || isLoading) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Order Date</h3>
                      <p className="text-muted-foreground">{formatDate(order.orderDate)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Estimated Delivery</h3>
                      <p className="text-muted-foreground">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.type === "buy" ? "Buy" : "Rent"} - Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Delivery Address</h3>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 