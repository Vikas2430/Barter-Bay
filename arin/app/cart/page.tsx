"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const shipping = 10
  const total = subtotal + shipping

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please login to proceed with checkout")
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some items to your cart to see them here.</p>
        <Button asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-muted-foreground">
                    {item.type === "buy" ? "Buy" : "Rent"} - {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 