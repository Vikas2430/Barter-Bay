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
      "/Vintage Leather jacket.jpg",
      "/Vintage Leather jacket.jpg",
      "/Vintage Leather jacket.jpg",
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
    images: ["/iphone.jpg", "/iphone.jpg"],
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
    images: ["/antique chair.jpg", "/antique chair.jpg"],
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
    images: ["/Mountain Bike.jpg", "/Mountain Bike.jpg"],
    features: [
      "21-Speed Shimano Gears",
      "Front Suspension",
      "Alloy Frame",
      "Disc Brakes",
      "Tubeless Ready",
    ],
  },
  {
    id: "5",
    title: "Gaming Laptop",
    price: 63750,
    description: "High-performance gaming laptop with the latest graphics card and processor. Perfect for gaming and content creation.",
    condition: "Like New",
    category: "Electronics",
    location: "Mumbai, Maharashtra",
    seller: {
      name: "Gaming Gear",
      rating: 4.7,
      reviews: 92,
      joined: "Aug 2021",
    },
    images: ["/gaming.jpeg", "/gaming.jpeg"],
    features: [
      "RTX 3070 Graphics",
      "16GB RAM",
      "1TB SSD",
      "144Hz Display",
      "RGB Keyboard",
    ],
  },
  {
    id: "6",
    title: "Handmade Ceramic Vase",
    price: 3375,
    description: "Beautiful handmade ceramic vase with unique patterns. A perfect decorative piece for your home.",
    condition: "New",
    category: "Home Decor",
    location: "Jaipur, Rajasthan",
    seller: {
      name: "Artisan Crafts",
      rating: 4.9,
      reviews: 156,
      joined: "Dec 2020",
    },
    images: ["/vase.jpg", "/vase.jpg"],
    features: [
      "Handcrafted Design",
      "Unique Patterns",
      "Durable Material",
      "Perfect for Flowers",
      "Modern Aesthetic",
    ],
  },
  {
    id: "7",
    title: "Vintage Vinyl Records Collection",
    price: 11250,
    description: "Rare collection of vintage vinyl records from the 70s and 80s. Includes classic albums in excellent condition.",
    condition: "Good",
    category: "Collectibles",
    location: "Delhi",
    seller: {
      name: "Vinyl Collector",
      rating: 4.8,
      reviews: 78,
      joined: "May 2021",
    },
    images: ["/vinyl collection.jpeg", "/vinyl collection.jpeg"],
    features: [
      "Classic Albums",
      "Original Pressings",
      "Excellent Condition",
      "Complete Collection",
      "Includes Album Art",
    ],
  },
  {
    id: "8",
    title: "Canon EOS 5D Mark IV",
    price: 90000,
    description: "Professional-grade DSLR camera with 30.4MP full-frame sensor. Perfect for professional photography.",
    condition: "Like New",
    category: "Electronics",
    location: "Bangalore, Karnataka",
    seller: {
      name: "Pro Photography",
      rating: 4.9,
      reviews: 203,
      joined: "Mar 2020",
    },
    images: ["/Canon5DIV_hero3_4000-1920x1266.jpg", "/Canon5DIV_hero3_4000-1920x1266.jpg"],
    features: [
      "30.4MP Full-Frame Sensor",
      "4K Video Recording",
      "Dual Pixel AF",
      "Weather Sealed",
      "Includes Lenses",
    ],
  }
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