"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

export default function CreateRentalListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    securityDeposit: "",
    deliveryAvailable: false,
    deliveryCharges: "",
    contactInfo: "",
    condition: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!formData.condition) {
      toast.error("Please select the condition of the item");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formDataToSend = new FormData();
      
      // Add basic form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'pricePerDay' && key !== 'pricePerWeek' && key !== 'pricePerMonth' && key !== 'securityDeposit' && key !== 'deliveryCharges') {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Add type and price data
      formDataToSend.append('type', 'rental');
      formDataToSend.append('pricePerDay', formData.pricePerDay);
      formDataToSend.append('pricePerWeek', formData.pricePerWeek);
      formDataToSend.append('pricePerMonth', formData.pricePerMonth);
      formDataToSend.append('securityDeposit', formData.securityDeposit);
      if (formData.deliveryAvailable) {
        formDataToSend.append('deliveryCharges', formData.deliveryCharges);
      }
      
      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      if (data.success) {
        toast.success('Rental listing created successfully!');
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          pricePerDay: "",
          pricePerWeek: "",
          pricePerMonth: "",
          securityDeposit: "",
          deliveryAvailable: false,
          deliveryCharges: "",
          contactInfo: "",
          condition: ""
        });
        setImages([]);
        setPreviewUrls([]);
      } else {
        throw new Error(data.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Rental Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="sports">Sports Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerWeek">Price per Week</Label>
                <Input
                  id="pricePerWeek"
                  type="number"
                  value={formData.pricePerWeek}
                  onChange={(e) => setFormData({ ...formData, pricePerWeek: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerMonth">Price per Month</Label>
                <Input
                  id="pricePerMonth"
                  type="number"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, deliveryAvailable: checked })}
              />
              <Label htmlFor="deliveryAvailable">Delivery Available</Label>
            </div>

            {formData.deliveryAvailable && (
              <div className="space-y-2">
                <Label htmlFor="deliveryCharges">Delivery Charges</Label>
                <Input
                  id="deliveryCharges"
                  type="number"
                  value={formData.deliveryCharges}
                  onChange={(e) => setFormData({ ...formData, deliveryCharges: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Textarea
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 