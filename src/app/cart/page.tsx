
"use client";

import Image from "next/image";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, CreditCard, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const SHIPPING_COST = 5.00;

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart, isClient } = useAppContext();
  const [requestShipping, setRequestShipping] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmRemoveItem, setConfirmRemoveItem] = useState<string | null>(null);

  const handleClearCart = () => {
    clearCart();
    setConfirmClearOpen(false);
  };

  const handleRemoveItem = () => {
    if (confirmRemoveItem) {
      removeFromCart(confirmRemoveItem);
      setConfirmRemoveItem(null);
    }
  };

  if (!isClient) {
      return (
      <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <aside className="sticky top-24">
            <Skeleton className="h-72 w-full rounded-lg" />
          </aside>
        </div>
      </div>
    );
  }

  const finalTotal = requestShipping ? cartTotal + SHIPPING_COST : cartTotal;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 stats-box">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
          <Link href="/">
            <Button className="glass-button glass-button-green">Ir a la tienda</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const price = item.discountPrice ?? item.price;
                return (
                  <div key={item.id} className="main-table-container p-4 flex items-start gap-4">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover aspect-square border border-white/20"
                      data-ai-hint="product photo"
                    />
                    <div className="flex-grow">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input type="number" value={item.quantity} onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 1)} className="w-16 h-8 text-center" />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${(price * item.quantity).toFixed(2)}</p>
                      {item.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">${(item.price * item.quantity).toFixed(2)}</p>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-2" onClick={() => setConfirmRemoveItem(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="text-right mt-4">
                <Button variant="outline" className="glass-button glass-button-red" onClick={() => setConfirmClearOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4"/>
                  Vaciar Carrito
                </Button>
              </div>
            </div>

            <aside className="sticky top-24">
              <Card className="stats-box">
                <CardHeader>
                  <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Envío</span>
                    {requestShipping ? (
                      <span className="font-semibold">${SHIPPING_COST.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted-foreground">No solicitado</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shipping" checked={requestShipping} onCheckedChange={(checked) => setRequestShipping(checked as boolean)} />
                    <Label htmlFor="shipping" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Solicitar envío
                    </Label>
                  </div>
                  <Separator className="my-2 bg-white/40" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full glass-button glass-button-green" size="lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceder al Pago
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>

          <ConfirmationDialog
            open={confirmClearOpen}
            onOpenChange={setConfirmClearOpen}
            onConfirm={handleClearCart}
            title="¿Vaciar el carrito?"
            description="Estás a punto de eliminar todos los productos de tu carrito. ¿Estás seguro?"
          />

          <ConfirmationDialog
            open={!!confirmRemoveItem}
            onOpenChange={(open) => !open && setConfirmRemoveItem(null)}
            onConfirm={handleRemoveItem}
            title="¿Quitar producto?"
            description="Este producto se eliminará de tu carrito. ¿Estás seguro?"
          />
        </>
      )}
    </div>
  );
}
