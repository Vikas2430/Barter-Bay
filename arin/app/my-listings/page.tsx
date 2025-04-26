"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { Edit, Trash2 } from "lucide-react"

interface Image {
  _id: string
  data: string
  contentType: string
  filename: string
}

interface Listing {
  _id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: Image[]
  location: string
  status: string
  type: string
  createdAt: string
}

export default function MyListingsPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:5000/api/listings/my-listings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch listings')
        }

        const data = await response.json()
        if (data.success) {
          const saleListings = data.data.listings.filter((listing: any) => 
            listing.type === 'sale' || !listing.type
          )
          console.log('Sale listings:', saleListings)
          setListings(saleListings)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        toast.error('Failed to load your listings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [isLoggedIn, router])

  const handleDelete = async (listingId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:5000/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

      const data = await response.json()
      if (data.success) {
        setListings(listings.filter(listing => listing._id !== listingId))
        toast.success('Listing deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast.error('Failed to delete listing')
    }
  }

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

  const getImageUrl = (image: Image) => {
    if (!image || !image.data) return "/placeholder.svg"
    return `data:${image.contentType};base64,${image.data}`
  }

  if (!isLoggedIn || isLoading) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => router.push('/sell')}>Create Listing</Button>
      </div>
      
      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-lg text-gray-500">You haven't listed any items for sale yet.</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/sell')}
              >
                Create Your First Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing._id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                <CardDescription>
                  Listed on {formatDate(listing.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative mb-4">
                  <img
                    src={getImageUrl(listing.images[0])}
                    alt={listing.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Price:</span>
                    <span>{formatPrice(listing.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Location:</span>
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Condition:</span>
                    <span className="capitalize">{listing.condition}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/edit-listing/${listing._id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(listing._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 