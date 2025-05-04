"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Heart } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@barterbay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Market Street, Raipur, India</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Our Commitment to You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              At BarterBay, we believe that every customer is a valued member of our community. 
              Your trust and satisfaction are at the heart of everything we do. We're committed 
              to providing you with a seamless and enjoyable experience as you buy, sell, and 
              trade items on our platform.
            </p>
            <p>
              Our dedicated support team is always here to assist you with any questions or 
              concerns you may have. Whether you're a first-time user or a long-time member 
              of our community, we're here to ensure your experience with BarterBay is nothing 
              short of exceptional.
            </p>
            <p>
              Thank you for choosing BarterBay as your trusted marketplace. We look forward 
              to serving you and helping you find great deals or sell your items with ease.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 