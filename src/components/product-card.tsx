
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showDelete?: boolean;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, showDelete = false, onDelete }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const { toast } = useToast();
  const favorite = isFavorite(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    toast({
      title: favorite ? "Eliminado de favoritos" : "Añadido a favoritos",
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(product.id);
    }
  }

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out group bg-card/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 rounded-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/product/${product.id}`} passHref>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-auto object-cover aspect-square rounded-t-xl cursor-pointer"
              data-ai-hint="product photo"
            />
          </Link>
          {product.discountPrice && (
            <Badge variant="destructive" className="absolute top-3 left-3 shadow-md">
              OFERTA
            </Badge>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-full text-white hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            onClick={showDelete ? handleDeleteClick : handleFavoriteClick}
          >
            {showDelete ? <Trash2 className="h-4 w-4" /> : <Heart className={cn("h-4 w-4", favorite && "fill-current text-rose-500")} />}
            <span className="sr-only">{showDelete ? 'Eliminar de favoritos' : 'Añadir a favoritos'}</span>
          </Button>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold leading-tight mb-2 h-8 truncate">
            <Link href={`/product/${product.id}`} passHref className="hover:text-primary transition-colors">
              {product.name}
            </Link>
          </h3>
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <p className="text-base font-bold text-destructive">
                  ${product.discountPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-base font-bold">${product.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
