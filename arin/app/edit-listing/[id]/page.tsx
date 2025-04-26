"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ImagePlus, Upload } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Image from "next/image"
import { use } from "react"

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Other"
]

const conditions = [
  "new",
  "like-new",
  "good",
  "fair",
  "poor"
]

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
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    contactInfo: ""
  })
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch listing')
        }

        const data = await response.json()
        if (data.success) {
          setListing(data.data.listing)
          setFormData({
            title: data.data.listing.title,
            description: data.data.listing.description,
            price: data.data.listing.price.toString(),
            category: data.data.listing.category,
            condition: data.data.listing.condition,
            location: data.data.listing.location,
            contactInfo: data.data.listing.contactInfo || ""
          })
          setPreviewImages(data.data.listing.images.map((img: Image) => 
            `data:${img.contentType};base64,${img.data}`
          ))
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
        toast.error('Failed to load listing data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [isLoggedIn, router, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages])
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file))
      setPreviewImages(prev => [...prev, ...newPreviewUrls])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Create the request body
      const requestBody = {
        title: formData.title,
        description: formData.description,
        price: {
          amount: parseFloat(formData.price)
        },
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        type: 'sale',
        contactInfo: formData.contactInfo || 'Contact seller for details'
      }

      const formDataToSend = new FormData()
      
      // Add all fields to FormData
      Object.entries(requestBody).forEach(([key, value]) => {
        if (key === 'price') {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, String(value))
        }
      })
      
      // Add images if new ones are selected
      images.forEach(image => {
        formDataToSend.append('images', image)
      })

      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      const data = await response.json()
      console.log('Server response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update listing')
      }

      if (data.success) {
        toast.success('Listing updated successfully!')
        router.push('/my-listings')
      } else {
        throw new Error(data.error || 'Failed to update listing')
      }
    } catch (error) {
      console.error('Error updating listing:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn || isLoading) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
        <p className="text-muted-foreground mb-8">Update your item's details below.</p>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Update basic information about your item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Vintage Leather Jacket"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Update your item's images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Add New Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
              <CardDescription>Update your price and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 