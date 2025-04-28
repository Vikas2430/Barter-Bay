"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search } from "lucide-react"

// Mock listings data
const listings = [
  {
    id: "LST-001",
    title: "Mountain Bike",
    description: "Barely used mountain bike in excellent condition",
    price: "$350.00",
    date: "2023-11-01",
    status: "active",
    seller: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "LST-002",
    title: "iPhone 12 Pro",
    description: "Used iPhone 12 Pro, 128GB, Pacific Blue",
    price: "$599.99",
    date: "2023-10-15",
    status: "sold",
    seller: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "LST-003",
    title: "Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness",
    price: "$45.00",
    date: "2023-09-22",
    status: "active",
    seller: {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "LST-004",
    title: "Vintage Record Player",
    description: "1970s record player in working condition",
    price: "$120.00",
    date: "2023-10-05",
    status: "active",
    seller: {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "LST-005",
    title: "Gaming Laptop",
    description: "High-performance gaming laptop, 1 year old",
    price: "$1,200.00",
    date: "2023-11-03",
    status: "active",
    seller: {
      id: "5",
      name: "Michael Wilson",
      email: "michael@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "LST-006",
    title: "Antique Bookshelf",
    description: "Wooden bookshelf from the early 1900s",
    price: "$250.00",
    date: "2023-10-20",
    status: "sold",
    seller: {
      id: "6",
      name: "Sarah Brown",
      email: "sarah@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "sold":
      return "bg-gray-100 text-gray-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || listing.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">Manage product listings across the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Listings</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search listings..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>A list of all product listings with their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{listing.title}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {listing.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={listing.seller.image || "/placeholder.svg"} alt={listing.seller.name} />
                          <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{listing.seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{listing.date}</TableCell>
                    <TableCell>{listing.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href={`/admin/listings/${listing.id}`} className="flex w-full items-center">
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/users/${listing.seller.id}`} className="flex w-full items-center">
                              View seller
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
