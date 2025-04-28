"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, X } from "lucide-react"
import { useState } from "react"
import { Sidebar } from "./sidebar"

export function TopNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full appearance-none bg-white pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-16 items-center gap-4 border-b bg-white px-4">
            <Button variant="outline" size="icon" onClick={() => setShowMobileMenu(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
            <div className="ml-4 font-semibold">Barter Bay Admin</div>
          </div>
          <div className="p-4">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  )
}
