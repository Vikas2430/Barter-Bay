"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Github } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface RegisterData {
  username: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  })
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerData.password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Login the user after successful registration
      login(data.data.token, data.data.user)
      toast.success("Registration successful!")
      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const requestBody = JSON.stringify(loginData)
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody,
        credentials: 'include'
      })

      // Get the response text first
      const responseText = await response.text()
      
      // Check if the response is ok
      if (!response.ok) {
        // Try to parse the error response as JSON
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || 'Login failed')
        } catch (e) {
          // If parsing fails, use the raw text
          throw new Error(`Login failed: ${responseText}`)
        }
      }

      // Only try to parse as JSON if we have content
      if (!responseText.trim()) {
        throw new Error('Empty response from server')
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
        console.error('Response text that failed to parse:', responseText)
        throw new Error('Server returned invalid JSON response')
      }

      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }

      // Login the user
      login(data.data.token, data.data.user)
      toast.success("Login successful!")
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Barter Bay</CardTitle>
          <CardDescription>Buy and sell pre-loved items with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Username</Label>
                  <Input
                    id="register-name"
                    placeholder="johndoe"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

