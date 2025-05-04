"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchDropdown } from "@/components/search-dropdown"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import { useRouter } from "next/navigation"

// Mock products data for search suggestions
const mockProducts = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 6749,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "iPhone 12 Pro",
    price: 37499,
    image: "/iphone.jpg",
  },
  {
    id: "3",
    title: "Antique Wooden Chair",
    price: 9000,
    image: "/antique chair.jpg",
  },
  {
    id: "4",
    title: "Mountain Bike",
    price: 26250,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "Canon EOS 5D Mark IV",
    price: 90000,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Vintage Vinyl Records Collection",
    price: 11250,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "7",
    title: "Handmade Ceramic Vase",
    price: 3375,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "8",
    title: "Gaming Laptop",
    price: 63750,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function Home() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 bg-muted rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Buy and Sell Pre-loved Items</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your one-stop marketplace for finding unique second-hand treasures or selling items you no longer need.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <SearchDropdown products={mockProducts} />
            <Button onClick={() => router.push('/products')}>Search</Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products">
            <Button variant="link">View all</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            id="1"
            title="Vintage Leather Jacket"
            price={6749}
            image="/Vintage Leather jacket.jpg"
            seller="john_doe"
            condition="Good"
          />
          <ProductCard
            id="2"
            title="iPhone 12 Pro"
            price={37499}
            image="/iphone.jpg"
            seller="tech_reseller"
            condition="Like New"
          />
          <ProductCard
            id="3"
            title="Antique Wooden Chair"
            price={9000}
            image="/antique chair.jpg"
            seller="vintage_finds"
            condition="Used"
          />
          <ProductCard
            id="4"
            title="Mountain Bike"
            price={26250}
            image="/Mountain Bike.jpg"
            seller="outdoor_enthusiast"
            condition="Good"
          />
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <CategoryFilter category="Electronics" icon="smartphone" />
          <CategoryFilter category="Clothing" icon="shirt" />
          <CategoryFilter category="Furniture" icon="armchair" />
          <CategoryFilter category="Sports" icon="dumbbell" />
          <CategoryFilter category="Collectibles" icon="trophy" />
        </div>
      </section>

      <section>
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to sell your items?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            List your unused items in minutes and turn them into cash. Our marketplace connects you with thousands of
            potential buyers.
          </p>
          <Link href="/sell">
            <Button size="lg">Start Selling</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

