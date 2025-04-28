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
import { useToast } from "@/hooks/use-toast"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    date: "2023-11-05",
    customer: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Vintage Camera",
    status: "pending",
    total: "$125.00",
  },
  {
    id: "ORD-002",
    date: "2023-10-22",
    customer: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Leather Jacket",
    status: "in-transit",
    total: "$249.99",
  },
  {
    id: "ORD-003",
    date: "2023-09-15",
    customer: {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Antique Watch",
    status: "shipped",
    total: "$199.50",
  },
  {
    id: "ORD-004",
    date: "2023-08-30",
    customer: {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Vinyl Records Collection",
    status: "delivered",
    total: "$89.99",
  },
  {
    id: "ORD-005",
    date: "2023-11-02",
    customer: {
      id: "5",
      name: "Michael Wilson",
      email: "michael@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Vintage Typewriter",
    status: "pending",
    total: "$175.00",
  },
  {
    id: "ORD-006",
    date: "2023-10-18",
    customer: {
      id: "6",
      name: "Sarah Brown",
      email: "sarah@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Polaroid Camera",
    status: "shipped",
    total: "$120.00",
  },
  {
    id: "ORD-007",
    date: "2023-10-05",
    customer: {
      id: "7",
      name: "David Miller",
      email: "david@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    product: "Vintage Radio",
    status: "delivered",
    total: "$85.50",
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
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    orders.reduce((acc, order) => ({ ...acc, [order.id]: order.status }), {}),
  )

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, you would call an API to update the order status
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }))

    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>A list of all customer orders with their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.customer.image || "/placeholder.svg"} alt={order.customer.name} />
                          <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customer.name}</span>
                          <span className="text-xs text-muted-foreground">{order.customer.email}</span>
                        </div>

                      </div>
                    </TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Select
                        value={orderStatuses[order.id]}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge className={getStatusColor(orderStatuses[order.id])}>
                              {orderStatuses[order.id].charAt(0).toUpperCase() + orderStatuses[order.id].slice(1)}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
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
                            <Link href={`/admin/orders/${order.id}`} className="flex w-full items-center">
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/users/${order.customer.id}`} className="flex w-full items-center">
                              View customer
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
