"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">About Us</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            Welcome to Barter Bay Marketplace — your all-in-one platform for buying, selling, renting, and auctioning goods in a smarter, more sustainable way.
          </p>

          <div className="bg-muted rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="mb-4">
              At Barter Bay, we believe in value exchange with flexibility. That's why our platform supports:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Product rentals by the day, so you can earn or save without permanent ownership</li>
              <li>Traditional buying and selling for when you're ready to commit</li>
              <li>Auctions for unique and high-value items</li>
              <li>Community-driven marketplace for sustainable consumption</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              Our mission is to create a community-driven ecosystem where items are not just bought and sold — they circulate meaningfully.
            </p>
            <p className="mb-4">
              Whether you're decluttering, borrowing, or hunting for a great deal, Barter Bay Marketplace is the destination that combines convenience, creativity, and conscious consumerism.
            </p>
          </div>

          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="mb-6">
              Join us — and make every item count.
            </p>
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 