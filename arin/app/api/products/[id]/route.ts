import { NextResponse } from "next/server"

// Mock database
const products = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 6749,
    description: "This authentic vintage leather jacket features a classic design with a comfortable fit. Made from genuine leather, it offers durability and style that will last for years. The jacket includes two front pockets, a full-length zipper, and adjustable cuffs.",
    condition: "Good",
    category: "Clothing",
    location: "Kanpur, UP",
    seller: {
      name: "John Doe",
      rating: 4.8,
      reviews: 56,
      joined: "Jan 2022",
    },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    features: [
      "100% Genuine Leather",
      "Classic Vintage Design",
      "Durable Construction",
      "Comfortable Fit",
      "Two Front Pockets",
    ],
  },
  {
    id: "2",
    title: "iPhone 12 Pro",
    price: 37499,
    description: "iPhone 12 Pro in excellent condition. Includes charger and original box.",
    condition: "Like New",
    category: "Electronics",
    location: "Shankar Nagar, Raipur",
    seller: {
      name: "Tech Reseller",
      rating: 4.9,
      reviews: 128,
      joined: "Mar 2021",
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    features: [
      "A14 Bionic Chip",
      "Pro Camera System",
      "Super Retina XDR Display",
      "5G Capable",
      "MagSafe Compatible",
    ],
  },
  {
    id: "3",
    title: "Antique Wooden Chair",
    price: 9000,
    description: "Beautiful antique wooden chair with intricate carvings. A perfect addition to any vintage collection.",
    condition: "Used",
    category: "Furniture",
    location: "Lucknow, UP",
    seller: {
      name: "Vintage Finds",
      rating: 4.7,
      reviews: 89,
      joined: "Jun 2020",
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    features: [
      "Solid Oak Construction",
      "Hand-Carved Details",
      "Circa 1920s",
      "Original Finish",
      "Sturdy and Durable",
    ],
  },
  {
    id: "4",
    title: "Mountain Bike",
    price: 26250,
    description: "High-quality mountain bike suitable for trails and adventures. Perfect for outdoor enthusiasts.",
    condition: "Good",
    category: "Sports",
    location: "Bhopal, MP",
    seller: {
      name: "Outdoor Enthusiast",
      rating: 4.6,
      reviews: 45,
      joined: "Sep 2021",
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    features: [
      "21-Speed Shimano Gears",
      "Front Suspension",
      "Alloy Frame",
      "Disc Brakes",
      "Tubeless Ready",
    ],
  },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
} 