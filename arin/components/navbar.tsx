"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, ShoppingCart, Heart, LogIn, User, LogOut, Package, Moon, Sun } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-semibold">
                Home
              </Link>
              <Link href="/products" className="text-lg font-semibold">
                All Products
              </Link>
              <Link href="/sell" className="text-lg font-semibold">
                Sell
              </Link>
              <Link href="/rental" className="text-lg font-semibold">
                Rent
              </Link>
              <Link href="/about" className="text-lg font-semibold">
                About
              </Link>
              <Link href="/contact" className="text-lg font-semibold">
                Contact
              </Link>
              {isLoggedIn && (
                <Link href="/profile" className="text-lg font-semibold">
                  Profile
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-xl">Barter Bay</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link href="/products" className="transition-colors hover:text-foreground/80">
            All Products
          </Link>
          <Link href="/sell" className="transition-colors hover:text-foreground/80">
            Sell
          </Link>
          <Link href="/rental" className="transition-colors hover:text-foreground/80">
            Rent
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/my-listings')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Listings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/my-rentals')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Rentals</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/orders')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

