"use client"

import { useState } from "react"
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

export default function SellPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    deliveryAvailable: false
  })

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > 8) {
      toast.error("You can upload a maximum of 8 images")
      return
    }

    setImages(prev => [...prev, ...Array.from(files)])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoggedIn) {
      toast.error("Please login to list an item")
      router.push('/login')
      return
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const formDataToSend = new FormData()
      
      // Add basic form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'price' && key !== 'deliveryAvailable') {
          formDataToSend.append(key, String(value))
        }
      })
      
      // Add required fields
      formDataToSend.append('type', 'sale')
      formDataToSend.append('contactInfo', 'Contact seller for details')
      formDataToSend.append('deliveryAvailable', 'false')
      
      // Add price data
      const price = {
        amount: parseFloat(formData.price)
      }
      formDataToSend.append('price', JSON.stringify(price))
      
      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image)
      })

      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create listing')
      }

      const data = await response.json()
      if (data.success) {
        toast.success('Item listed successfully!')
        router.push('/my-listings')
      } else {
        throw new Error(data.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
        <p className="text-muted-foreground mb-8">Fill out the form below to list your item for sale.</p>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Provide basic information about your item</CardDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                    required
                  >
                    <SelectTrigger id="category">
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
                    required
                  >
                    <SelectTrigger id="condition">
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail. Include information about brand, size, color, etc."
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Add up to 8 photos of your item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden border relative group">
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}

                {images.length < 8 && (
                  <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                    >
                      <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center">Click to add images</span>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
              <CardDescription>Set your price and location details</CardDescription>
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
                  Listing...
                </>
              ) : (
                "List Item for Sale"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

