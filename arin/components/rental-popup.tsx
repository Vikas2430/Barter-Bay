import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface RentalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (duration: string, quantity: number, totalAmount: number) => void;
  item: {
    title: string;
    pricing: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    securityDeposit: number;
    deliveryAvailable: boolean;
    deliveryCharges: number;
  };
}

export function RentalPopup({ isOpen, onClose, onConfirm, item }: RentalPopupProps) {
  const [duration, setDuration] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const calculateTotal = () => {
    let basePrice = 0;
    switch (duration) {
      case "daily":
        basePrice = item.pricing.daily;
        break;
      case "weekly":
        basePrice = item.pricing.weekly;
        break;
      case "monthly":
        basePrice = item.pricing.monthly;
        break;
      default:
        basePrice = 0;
    }

    const subtotal = basePrice * quantity;
    const deliveryCost = item.deliveryAvailable ? item.deliveryCharges : 0;
    const total = subtotal + item.securityDeposit + deliveryCost;

    return {
      subtotal,
      deliveryCost,
      securityDeposit: item.securityDeposit,
      total,
    };
  };

  const costs = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rent {item.title}</CardTitle>
          <CardDescription>Choose your rental duration and Checkout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Rental Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (₹{item.pricing.daily})</SelectItem>
                  <SelectItem value="weekly">Weekly (₹{item.pricing.weekly})</SelectItem>
                  <SelectItem value="monthly">Monthly (₹{item.pricing.monthly})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Enter Number"
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    setQuantity(value);
                  }
                }}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Cost Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Rental Fee</span>
                  <span>₹{costs.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit</span>
                  <span>₹{costs.securityDeposit}</span>
                </div>
                {item.deliveryAvailable && (
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>₹{costs.deliveryCost}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Due Now</span>
                  <span>₹{costs.total}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(duration, quantity, costs.total)}
            disabled={!duration}
          >
            Confirm Rental
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 