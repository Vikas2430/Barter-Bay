"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Image from "next/image"

interface Pricing {
  daily: number;
  weekly: number;
  monthly: number;
}

interface RentalItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  pricing: Pricing;
  securityDeposit: number;
  deliveryAvailable: boolean;
  deliveryCharges: number;
  contactInfo: string;
  photos: string[];
  status?: string;
  rentalStartDate?: Date;
}

// Dummy rental items
const dummyRentals: RentalItem[] = [
  {
    id: "1",
    title: "Professional Camera",
    description: "Canon EOS R5 - 45MP Full-Frame Mirrorless Camera with 8K Video",
    category: "Electronics",
    condition: "Like New",
    location: "New York, NY",
    pricing: {
      daily: 4000,
      weekly: 25000,
      monthly: 85000
    },
    securityDeposit: 40000,
    deliveryAvailable: true,
    deliveryCharges: 2000,
    contactInfo: "john@example.com",
    photos: ["/camera.jpg"]
  },
  {
    id: "2",
    title: "Mountain Bike",
    description: "Trek Fuel EX 9.8 - Full Suspension Mountain Bike",
    category: "Sports",
    condition: "Good",
    location: "Los Angeles, CA",
    pricing: {
      daily: 3000,
      weekly: 17000,
      monthly: 65000
    },
    securityDeposit: 25000,
    deliveryAvailable: false,
    deliveryCharges: 0,
    contactInfo: "sarah@example.com",
    photos: ["/bike.jpg"]
  },
  {
    id: "3",
    title: "DJ Equipment Set",
    description: "Pioneer CDJ-3000 + DJM-900NXS2 Professional DJ Setup",
    category: "Music",
    condition: "New",
    location: "Chicago, IL",
    pricing: {
      daily: 8000,
      weekly: 50000,
      monthly: 170000
    },
    securityDeposit: 85000,
    deliveryAvailable: true,
    deliveryCharges: 4000,
    contactInfo: "mike@example.com",
    photos: ["/dj.jpg"]
  },
  {
    id: "4",
    title: "Camping Tent",
    description: "4-Person Weatherproof Camping Tent with Rainfly",
    category: "Outdoor",
    condition: "Good",
    location: "Denver, CO",
    pricing: {
      daily: 2000,
      weekly: 12000,
      monthly: 42000
    },
    securityDeposit: 17000,
    deliveryAvailable: true,
    deliveryCharges: 1200,
    contactInfo: "alex@example.com",
    photos: ["/tent.jpg"]
  },
  {
    id: "5",
    title: "Power Tools Set",
    description: "Complete DeWalt 20V MAX Power Tools Kit with 5 Tools",
    category: "Tools",
    condition: "Like New",
    location: "Houston, TX",
    pricing: {
      daily: 3500,
      weekly: 21000,
      monthly: 75000
    },
    securityDeposit: 35000,
    deliveryAvailable: true,
    deliveryCharges: 2500,
    contactInfo: "david@example.com",
    photos: ["/tools.jpg"]
  }
];

export default function RentalPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [availableRentals, setAvailableRentals] = useState<RentalItem[]>(dummyRentals);
  const [myRentals, setMyRentals] = useState<RentalItem[]>([]);

  const handleRent = async (rentalId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to rent items");
      router.push("/login");
      return;
    }

    try {
      // In a real application, this would be an API call
      const rental = availableRentals.find(r => r.id === rentalId);
      if (rental) {
        setAvailableRentals(prev => prev.filter(r => r.id !== rentalId));
        setMyRentals(prev => [...prev, { ...rental, status: "rented", rentalStartDate: new Date() }]);
        toast.success("Item rented successfully!");
      }
    } catch (error) {
      toast.error("Failed to rent item");
    }
  };

  const handleReturn = async (rentalId: string) => {
    try {
      // In a real application, this would be an API call
      const rental = myRentals.find(r => r.id === rentalId);
      if (rental) {
        setMyRentals(prev => prev.filter(r => r.id !== rentalId));
        setAvailableRentals(prev => [...prev, { ...rental, status: "available" }]);
        toast.success("Item returned successfully!");
      }
    } catch (error) {
      toast.error("Failed to return item");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rental Marketplace</h1>
        <Button onClick={() => router.push('/rental/create')}>Create Listing</Button>
      </div>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="my-rentals">My Rentals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRentals.map((rental) => (
              <Card key={rental.id}>
                <CardHeader>
                  <CardTitle>{rental.title}</CardTitle>
                  <CardDescription>{rental.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Category:</span> {rental.category}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Condition:</span> {rental.condition}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Location:</span> {rental.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Daily Rate:</span> ₹{rental.pricing.daily}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Weekly Rate:</span> ₹{rental.pricing.weekly}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Monthly Rate:</span> ₹{rental.pricing.monthly}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Security Deposit:</span> ₹{rental.securityDeposit}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Delivery:</span> {rental.deliveryAvailable ? "Available" : "Not Available"}
                    </p>
                    {rental.deliveryAvailable && (
                      <p className="text-sm">
                        <span className="font-semibold">Delivery Charges:</span> ₹{rental.deliveryCharges}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleRent(rental.id)}>
                    Rent Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-rentals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRentals.map((rental) => (
              <Card key={rental.id}>
                <CardHeader>
                  <CardTitle>{rental.title}</CardTitle>
                  <CardDescription>
                    Rented on {rental.rentalStartDate ? new Date(rental.rentalStartDate).toLocaleDateString() : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span> {rental.status}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Daily Rate:</span> ₹{rental.pricing.daily}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Security Deposit:</span> ₹{rental.securityDeposit}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleReturn(rental.id)}
                  >
                    Return Item
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 