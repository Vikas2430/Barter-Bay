"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    total: "$125.00",
    date: "2023-11-05",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    status: "in-transit",
    total: "$79.99",
    date: "2023-11-04",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Robert Johnson",
      email: "robert@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    status: "shipped",
    total: "$249.99",
    date: "2023-11-03",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    status: "delivered",
    total: "$149.50",
    date: "2023-11-02",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Michael Wilson",
      email: "michael@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    total: "$59.99",
    date: "2023-11-01",
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

export function RecentOrders() {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={order.customer.image || "/placeholder.svg"} alt={order.customer.name} />
            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <div className="text-sm font-medium">{order.total}</div>
        </div>
      ))}
    </div>
  )
}
