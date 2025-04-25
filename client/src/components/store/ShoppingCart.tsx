import { Minus, Plus, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import type { CartItem } from "../../types"
import { useState } from "react"
import { CheckoutForm } from "./CheckoutForm"

interface ShoppingCartProps {
  cart: CartItem[]
  total: number
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  onClose: () => void
  onPurchaseComplete: (purchasedItems: CartItem[]) => void
}

export function ShoppingCart({
  cart,
  total,
  removeFromCart,
  updateQuantity,
  onClose,
  onPurchaseComplete,
}: ShoppingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const handleCheckout = () => {
    setIsCheckingOut(true)
  }

  const handleOrderComplete = () => {
    // Generate a random order ID
    const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`
    setOrderId(newOrderId)
    setOrderComplete(true)

    // Pass the purchased items to parent component
    onPurchaseComplete(cart)
  }

  if (orderComplete) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Confirmed!</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Thank you for your purchase!</p>
            <p>Your order #{orderId} has been confirmed.</p>
            <p>You will receive an email confirmation shortly.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onClose}>
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (isCheckingOut) {
    return (
      <CheckoutForm
        cart={cart}
        total={total}
        onCancel={() => setIsCheckingOut(false)}
        onComplete={handleOrderComplete}
      />
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shopping Cart</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.book.id} className="flex gap-3">
                <div className="w-12 h-16 shrink-0">
                  <img
                    src={item.book.coverUrl || "/placeholder.svg"}
                    alt={item.book.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.book.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.book.author}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm font-medium">${item.book.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        disabled={item.quantity >= item.book.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 self-start"
                  onClick={() => removeFromCart(item.book.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {cart.length > 0 && (
        <>
          <Separator />
          <CardFooter className="flex-col gap-4 pt-4">
            <div className="flex justify-between w-full">
              <span>Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
