import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { X } from "lucide-react"
import type { CartItem } from "../../types"

interface CheckoutFormProps {
  cart: CartItem[]
  total: number
  onCancel: () => void
  onComplete: () => void
}

export function CheckoutForm({ cart, total, onCancel, onComplete }: CheckoutFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 1500)
  }

  const isFormValid = Object.values(formState).every((value) => value.trim() !== "")

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Checkout</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Contact Information</h3>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Shipping Address</h3>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formState.address} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formState.city} onChange={handleChange} required />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input id="zip" name="zip" value={formState.zip} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Payment Information</h3>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formState.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formState.cardExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    name="cardCvc"
                    placeholder="123"
                    value={formState.cardCvc}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1">
              {cart.map((item) => (
                <div key={item.book.id} className="flex justify-between text-sm">
                  <span>
                    {item.book.title} × {item.quantity}
                  </span>
                  <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
