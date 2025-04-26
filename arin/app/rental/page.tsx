"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Image from "next/image"
import { RentalPopup } from "@/components/rental-popup"

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
  rentalEndDate?: Date;
  rentalQuantity?: number;
  rentalTotalAmount?: number;
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
  const [availableRentals, setAvailableRentals] = useState<RentalItem[]>([]);
  const [myRentals, setMyRentals] = useState<RentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRental, setSelectedRental] = useState<RentalItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch real rental listings
  const fetchRentals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rentals');
      }

      const data = await response.json();

      if (!data.success || !data.data?.listings) {
        throw new Error('Invalid response format from server');
      }

      // Filter rental listings and transform them to match the RentalItem format
      const rentalListings = data.data.listings
        .filter((listing: any) => listing.type === 'rental')
        .map((listing: any) => ({
          id: listing._id,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          condition: listing.condition,
          location: listing.location,
          pricing: {
            daily: listing.price?.perDay || 0,
            weekly: listing.price?.perWeek || 0,
            monthly: listing.price?.perMonth || 0
          },
          securityDeposit: listing.price?.securityDeposit || 0,
          deliveryAvailable: listing.deliveryAvailable || false,
          deliveryCharges: listing.price?.deliveryCharges || 0,
          contactInfo: listing.contactInfo || '',
          photos: listing.images?.map((img: any) => 
            `data:${img.contentType};base64,${img.data}`
          ) || ['/placeholder.svg'],
          status: listing.status,
          rentalStartDate: listing.rentalStartDate ? new Date(listing.rentalStartDate) : undefined
        }));

      // Only set real rentals if we have them, otherwise use dummy rentals
      if (rentalListings.length > 0) {
        setAvailableRentals(rentalListings);
      } else {
        setAvailableRentals(dummyRentals);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setError('Failed to load rentals. Please try again later.');
      // Fallback to dummy rentals if fetch fails
      setAvailableRentals(dummyRentals);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRentals();
  }, []);

  const handleRentClick = (rental: RentalItem) => {
    setSelectedRental(rental);
    setIsPopupOpen(true);
  };

  const handleRentalConfirm = async (duration: string, quantity: number, totalAmount: number) => {
    if (!selectedRental) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Calculate end date based on duration
      const startDate = new Date();
      let endDate = new Date();
      switch (duration) {
        case 'daily':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        default:
          endDate.setDate(endDate.getDate() + 7); // Default to weekly
      }

      // Make the rental request
      const response = await fetch(`http://localhost:5000/api/listings/${selectedRental.id}/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate,
          endDate,
          quantity,
          totalAmount
        })
      });

      // Handle the response
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Please login to rent items');
          router.push('/login');
          return;
        }
        const errorData = await response.json().catch(() => ({ error: 'Failed to rent item' }));
        throw new Error(errorData.error || 'Failed to rent item');
      }

      const data = await response.json();

      if (data.success) {
        const rental = data.data.listing;
        
        // Update the rental status in the UI
        setAvailableRentals(prev => 
          prev.map(item => 
            item.id === selectedRental.id 
              ? { ...item, status: 'rented', rentalStartDate: startDate }
              : item
          )
        );

        // Add to my rentals
        const newRental = {
          id: rental._id,
          title: rental.title,
          description: rental.description,
          category: rental.category,
          condition: rental.condition,
          location: rental.location,
          pricing: {
            daily: rental.price?.perDay || 0,
            weekly: rental.price?.perWeek || 0,
            monthly: rental.price?.perMonth || 0
          },
          securityDeposit: rental.price?.securityDeposit || 0,
          deliveryAvailable: rental.deliveryAvailable || false,
          deliveryCharges: rental.price?.deliveryCharges || 0,
          contactInfo: rental.contactInfo,
          photos: rental.images?.map((img: any) => img.data) || [],
          status: 'rented',
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          rentalQuantity: quantity,
          rentalTotalAmount: totalAmount
        };

        setMyRentals(prev => [...prev, newRental]);
        
        // Switch to My Rentals tab
        const tabsList = document.querySelector('[role="tablist"]');
        if (tabsList) {
          const myRentalsTab = tabsList.querySelector('[value="my-rentals"]');
          if (myRentalsTab) {
            (myRentalsTab as HTMLElement).click();
          }
        }

        toast.success("Item rented successfully!");
        setIsPopupOpen(false);
        setSelectedRental(null);
      }
    } catch (error) {
      console.error('Error renting item:', error);
      toast.error(error instanceof Error ? error.message : "Failed to rent item");
    }
  };

  const handleReturn = async (rentalId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/listings/${rentalId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to return item');
      }

      const data = await response.json();
      if (data.success) {
        // Update the rental status in the UI
        setAvailableRentals(prev => 
          prev.map(rental => 
            rental.id === rentalId 
              ? { ...rental, status: 'available', rentalStartDate: undefined }
              : rental
          )
        );
        // Remove from my rentals
        setMyRentals(prev => prev.filter(rental => rental.id !== rentalId));
        toast.success("Item returned successfully!");
      }
    } catch (error) {
      console.error('Error returning item:', error);
      toast.error(error instanceof Error ? error.message : "Failed to return item");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={fetchRentals} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

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
              <Card key={`available-${rental.id}`} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={rental.photos[0]}
                      alt={rental.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm line-clamp-2">{rental.description}</p>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold line-clamp-1">{rental.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {rental.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rental.deliveryAvailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {rental.deliveryAvailable ? 'Delivery Available' : 'No Delivery'}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Category:</span> {rental.category}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Condition:</span> {rental.condition}
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
                    {rental.deliveryAvailable && (
                      <p className="text-sm">
                        <span className="font-semibold">Delivery Charges:</span> ₹{rental.deliveryCharges}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-2">
                  <Button 
                    className="w-full" 
                    onClick={() => rental.status === 'rented' ? handleReturn(rental.id) : handleRentClick(rental)}
                    disabled={rental.status === 'rented'}
                  >
                    {rental.status === 'rented' ? 'Currently Rented' : 'Rent Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-rentals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRentals.map((rental) => (
              <Card key={`my-rental-${rental.id}-${rental.rentalStartDate?.getTime()}`}>
                <CardHeader>
                  <CardTitle>{rental.title}</CardTitle>
                  <CardDescription>{rental.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Rental Start Date:</span>{' '}
                      {rental.rentalStartDate?.toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Rental End Date:</span>{' '}
                      {rental.rentalEndDate?.toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Quantity:</span> {rental.rentalQuantity}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Total Amount:</span> ₹{rental.rentalTotalAmount}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span> {rental.status}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleReturn(rental.id)}
                    disabled={rental.status !== 'rented'}
                  >
                    Return Item
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedRental && (
        <RentalPopup
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedRental(null);
          }}
          onConfirm={handleRentalConfirm}
          item={selectedRental}
        />
      )}
    </div>
  );
} 