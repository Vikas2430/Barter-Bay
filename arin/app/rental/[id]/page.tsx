import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function RentalDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Item Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Camera</CardTitle>
              <CardDescription>Canon EOS R5 - 45MP Full-Frame Mirrorless</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg">
                  {/* Image placeholder */}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-gray-600">
                    Professional-grade mirrorless camera with 45MP resolution, perfect for photography and videography.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Condition</h3>
                  <p className="text-sm text-gray-600">Like New</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Process */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rent This Item</CardTitle>
              <CardDescription>Choose your rental duration and proceed to payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rental Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (₹50)</SelectItem>
                      <SelectItem value="weekly">Weekly (₹300)</SelectItem>
                      <SelectItem value="monthly">Monthly (₹1000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Rental Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Rental Fee</span>
                      <span>₹300.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit</span>
                      <span>₹500.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Due Now</span>
                      <span>₹800.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Proceed to Payment</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Security deposit will be held until item return</li>
                <li>Item must be returned in the same condition</li>
                <li>Late returns will incur additional charges</li>
                <li>Damage assessment will be done upon return</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 