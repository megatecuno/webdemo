
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FavoritesPanel() {
  const { favorites, addToCart, toggleFavorite } = useAppContext();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Producto añadido",
      description: `${product.name} fue añadido a tu carrito.`,
    });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Tus Favoritos</SheetTitle>
        <SheetDescription>
          Productos que has guardado. Añádelos al carrito cuando quieras.
        </SheetDescription>
      </SheetHeader>
      <Separator className="my-4" />
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="font-semibold">No tienes favoritos</p>
          <p className="text-sm text-muted-foreground">
            Haz clic en el corazón de un producto para guardarlo aquí.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-4">
            {favorites.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover aspect-square border"
                />
                <div className="flex-grow">
                  <Link href={`/product/${product.id}`} className="hover:underline">
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                  </Link>
                   <p className="text-sm font-bold mt-1">
                    ${(product.discountPrice ?? product.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                   <Button size="sm" className="w-full" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mover
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFavorite(product)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
