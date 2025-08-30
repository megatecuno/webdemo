

"use client";

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, X, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const { products } = useAppContext();
  const product = products.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen && event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);


  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Producto añadido",
      description: `${product.name} fue añadido a tu carrito.`,
    });
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Eliminado de favoritos" : "Añadido a favoritos",
    })
  }

  const handleChatWithSeller = () => {
    // Here you would implement logic to either open a chat modal
    // or navigate to the chat page with the specific seller.
    // For now, we'll just navigate to the profile/chat tab.
    toast({
      title: "Iniciando chat...",
      description: `Conectando con ${product.operator || 'el vendedor'}.`
    })
    router.push('/profile?tab=chats');
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-row-reverse gap-4">
          {product.images.length > 1 && (
            <div className="flex flex-col gap-3 w-24">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 transition-all",
                    index === selectedImageIndex ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover aspect-square"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="flex-grow">
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-white/20 shadow-lg rounded-xl">
              <CardContent className="p-0 relative">
                <button onClick={openModal} className="w-full h-full cursor-zoom-in">
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={`${product.name} - image ${selectedImageIndex + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover aspect-square transition-opacity duration-300"
                    data-ai-hint="product photo"
                  />
                </button>
                {product.images.length > 1 && (
                  <>
                    <Button
                      onClick={handlePrevImage}
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white h-10 w-10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={handleNextImage}
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white h-10 w-10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline">{product.category}</Badge>
            <h1 className="text-4xl font-bold text-secondary-foreground mt-2">{product.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-muted-foreground">(123 ratings)</span>
          </div>

          <div className="flex items-baseline gap-4">
            {product.discountPrice ? (
              <>
                <p className="text-4xl font-bold text-destructive">
                  ${product.discountPrice.toFixed(2)}
                </p>
                <p className="text-2xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="flex-1 glass-button glass-button-green" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Añadir al carrito
            </Button>
            <Button size="lg" variant="outline" className="glass-button" onClick={handleToggleFavorite}>
              <Heart className={cn("mr-2 h-5 w-5", isFavorite(product.id) && "fill-rose-500 text-rose-500")} />
              {isFavorite(product.id) ? "En favoritos" : "Añadir a favoritos"}
            </Button>
          </div>
          <Button size="lg" variant="outline" className="w-full glass-button glass-button-orange" onClick={handleChatWithSeller}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Chatear con el Vendedor
          </Button>

          <Separator className="my-6 bg-white/30" />

          <Card className="stats-box">
            <CardHeader>
              <CardTitle className="text-2xl">Descripción Detallada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-secondary-foreground/80 whitespace-pre-wrap">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
             <Image
              src={product.images[selectedImageIndex]}
              alt={`${product.name} - image ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
            <Button
              onClick={closeModal}
              variant="ghost"
              size="icon"
              className="absolute -top-4 -right-4 rounded-full bg-white/80 hover:bg-white text-black h-10 w-10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
