"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface ProfileData {
  name: string
  address: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    address: ""
  })
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch profile')
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch profile')
        }

        setUsername(data.data.username)
        setProfileData({
          name: data.data.profile.name || "",
          address: data.data.profile.address || ""
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to load profile data')
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          router.push('/login')
        }
      }
    }

    fetchProfile()
  }, [router, isLoggedIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, Country"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 