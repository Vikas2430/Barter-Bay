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
    location: "Kanpur, UP",
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
  {
    id: "3",
    title: "Antique Wooden Chair",
    price: 9000,
    description: "Beautiful antique wooden chair with intricate carvings.",
    condition: "Used",
    category: "Furniture",
    location: "Lucknow, UP",
    seller: {
      id: "user3",
      name: "Vintage Finds",
      rating: 4.7,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Mountain Bike",
    price: 26250,
    description: "High-quality mountain bike suitable for trails and adventures.",
    condition: "Good",
    category: "Sports",
    location: "Bhopal, MP",
    seller: {
      id: "user4",
      name: "Outdoor Enthusiast",
      rating: 4.6,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Canon EOS 5D Mark IV",
    price: 90000,
    description: "Professional DSLR camera with excellent image quality.",
    condition: "Like New",
    category: "Electronics",
    location: "Mumbai, MH",
    seller: {
      id: "user5",
      name: "Photo Pro",
      rating: 4.9,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Vintage Vinyl Records Collection",
    price: 11250,
    description: "Collection of classic vinyl records from the 70s and 80s.",
    condition: "Good",
    category: "Collectibles",
    location: "Delhi, DL",
    seller: {
      id: "user6",
      name: "Music Lover",
      rating: 4.8,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Handmade Ceramic Vase",
    price: 3375,
    description: "Beautiful handmade ceramic vase with unique patterns.",
    condition: "New",
    category: "Collectibles",
    location: "Jaipur, RJ",
    seller: {
      id: "user7",
      name: "Craft Artisan",
      rating: 4.7,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Gaming Laptop",
    price: 63750,
    description: "Powerful gaming laptop with high-performance graphics.",
    condition: "Used",
    category: "Electronics",
    location: "Bangalore, KA",
    seller: {
      id: "user8",
      name: "Gamer Zone",
      rating: 4.8,
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const condition = searchParams.get("condition")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    // Fetch user-listed products
    const response = await fetch('http://localhost:5000/api/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let userListings = []
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.data?.listings) {
        // Transform user listings to match the product format
        userListings = data.data.listings
          .filter((listing: any) => listing.type === 'sale' || !listing.type)
          .map((listing: any) => ({
            id: listing._id,
            title: listing.title,
            price: typeof listing.price === 'number' ? listing.price : (listing.price?.amount || 0),
            image: listing.images && listing.images.length > 0 
              ? `data:${listing.images[0].contentType};base64,${listing.images[0].data}`
              : "/placeholder.svg",
            seller: listing.seller?.username || 'Unknown',
            condition: listing.condition || 'Used',
            category: listing.category || 'Other',
            description: listing.description || 'No description available',
            createdAt: listing.createdAt
          }))
      }
    }

    // Combine mock products with user listings
    let allProducts = [...products, ...userListings]

    // Apply filters
    if (category) {
      allProducts = allProducts.filter((product) => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (condition) {
      allProducts = allProducts.filter((product) => 
        product.condition.toLowerCase() === condition.toLowerCase()
      )
    }

    if (minPrice) {
      allProducts = allProducts.filter((product) => 
        product.price >= Number.parseFloat(minPrice)
      )
    }

    if (maxPrice) {
      allProducts = allProducts.filter((product) => 
        product.price <= Number.parseFloat(maxPrice)
      )
    }

    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
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

