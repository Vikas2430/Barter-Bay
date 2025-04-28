"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, MapPin, Phone } from "lucide-react"

// Mock user data
const user = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, CA 12345",
  joinDate: "January 15, 2023",
  status: "active",
  image: "/placeholder.svg?height=128&width=128",
}

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    date: "2023-11-05",
    product: "Vintage Camera",
    status: "pending",
    total: "$125.00",
  },
  {
    id: "ORD-002",
    date: "2023-10-22",
    product: "Leather Jacket",
    status: "in-transit",
    total: "$249.99",
  },
  {
    id: "ORD-003",
    date: "2023-09-15",
    product: "Antique Watch",
    status: "shipped",
    total: "$199.50",
  },
  {
    id: "ORD-004",
    date: "2023-08-30",
    product: "Vinyl Records Collection",
    status: "delivered",
    total: "$89.99",
  },
]

// Mock listings data
const listings = [
  {
    id: "LST-001",
    title: "Mountain Bike",
    date: "2023-11-01",
    status: "active",
    price: "$350.00",
  },
  {
    id: "LST-002",
    title: "iPhone 12 Pro",
    date: "2023-10-15",
    status: "sold",
    price: "$599.99",
  },
  {
    id: "LST-003",
    title: "Desk Lamp",
    date: "2023-09-22",
    status: "active",
    price: "$45.00",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "in-transit":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "active":
      return "bg-green-100 text-green-800"
    case "sold":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <Button className="ml-auto" asChild>
          <Link href={`/admin/users/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View and manage user details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">User ID: {user.id}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{user.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Join Date</p>
                    <p className="text-sm text-muted-foreground">{user.joinDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">November 10, 2023</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-sm text-muted-foreground">{orders.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Listings</p>
                    <p className="text-sm text-muted-foreground">{listings.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Orders</CardTitle>
              <CardDescription>View and manage orders placed by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Listings</CardTitle>
              <CardDescription>View and manage listings created by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.id}</TableCell>
                        <TableCell>{listing.title}</TableCell>
                        <TableCell>{listing.date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.price}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/listings/${listing.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
