import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ListItemPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>List Item for Rent</CardTitle>
          <CardDescription>Fill in the details of your item to make it available for rent</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" placeholder="Enter item name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your item" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="daily-rate">Daily Rate ($)</Label>
                <Input id="daily-rate" type="number" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weekly-rate">Weekly Rate ($)</Label>
                <Input id="weekly-rate" type="number" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-rate">Monthly Rate ($)</Label>
                <Input id="monthly-rate" type="number" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="security-deposit">Security Deposit ($)</Label>
                <Input id="security-deposit" type="number" placeholder="0.00" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Item Condition</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" multiple accept="image/*" />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">List Item</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 