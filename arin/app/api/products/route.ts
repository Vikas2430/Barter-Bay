import { NextResponse } from "next/server"

// Mock database
const products = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 89.99,
    description: "This authentic vintage leather jacket features a classic design with a comfortable fit.",
    condition: "Good",
    category: "Clothing",
    location: "New York, NY",
    seller: {
      id: "user1",
      name: "John Doe",
      rating: 4.8,
    },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "iPhone 12 Pro",
    price: 499.99,
    description: "iPhone 12 Pro in excellent condition. Includes charger and original box.",
    condition: "Like New",
    category: "Electronics",
    location: "Shankar Nagar, Raipur",
    seller: {
      id: "user2",
      name: "Tech Reseller",
      rating: 4.9,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  // Get search params
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const condition = searchParams.get("condition")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  let filteredProducts = [...products]

  // Apply filters
  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  if (condition) {
    filteredProducts = filteredProducts.filter((product) => product.condition.toLowerCase() === condition.toLowerCase())
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price >= Number.parseFloat(minPrice))
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price <= Number.parseFloat(maxPrice))
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.price || !body.description || !body.category || !body.condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would save to a database
    const newProduct = {
      id: (products.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

