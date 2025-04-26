"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

interface Image {
  _id: string;
  data: string;
  contentType: string;
  filename: string;
}

interface RentalListing {
  _id: string;
  title: string;
  description: string;
  price: {
    perDay: number;
    perWeek: number;
    perMonth: number;
    securityDeposit: number;
    deliveryCharges: number;
  };
  category: string;
  condition: string;
  images: Image[];
  location: string;
  status: string;
  deliveryAvailable: boolean;
  contactInfo: string;
  createdAt: string;
}

export default function MyRentalsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [rentals, setRentals] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const fetchRentals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/listings/my-listings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rentals');
        }

        const data = await response.json();
        if (data.success) {
          // Filter only rental listings
          const rentalListings = data.data.listings.filter((listing: any) => listing.type === 'rental');
          setRentals(rentalListings);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
        toast.error('Failed to load your rentals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, [isLoggedIn, router]);

  const handleDelete = async (rentalId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/listings/${rentalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete rental');
      }

      const data = await response.json();
      if (data.success) {
        setRentals(rentals.filter(rental => rental._id !== rentalId));
        toast.success('Rental deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting rental:', error);
      toast.error('Failed to delete rental');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (image: Image) => {
    if (!image || !image.data) return "/placeholder.svg";
    return `data:${image.contentType};base64,${image.data}`;
  };

  if (!isLoggedIn || isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Rentals</h1>
        <Button onClick={() => router.push('/rental/create')}>Create Rental</Button>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-lg text-gray-500">You haven't listed any items for rent yet.</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/rental/create')}
              >
                Create Your First Rental
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <Card key={rental._id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={getImageUrl(rental.images[0])}
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
                      Listed on {formatDate(rental.createdAt)}
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Daily Rate</p>
                    <p className="text-lg font-semibold text-primary">{formatPrice(rental.price.perDay)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Security Deposit</p>
                    <p className="text-lg font-semibold text-primary">{formatPrice(rental.price.securityDeposit)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Weekly Rate</p>
                    <p className="text-sm font-medium">{formatPrice(rental.price.perWeek)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Monthly Rate</p>
                    <p className="text-sm font-medium">{formatPrice(rental.price.perMonth)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium">{rental.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Condition</span>
                      <span className="font-medium capitalize">{rental.condition}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/edit-rental/${rental._id}`)}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(rental._id)}
                  className="hover:bg-red-600 transition-colors"
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
  );
} 