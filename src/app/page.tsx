
"use client"

import Image from 'next/image';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Gem, Palette, BookOpen, Shirt, Smartphone, Home as HomeIcon, Bike, Search, HandHeart, CarFront } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useAppContext } from '@/contexts/app-context';
import { Skeleton } from '@/components/ui/skeleton';


const iconMap: { [key: string]: React.ElementType } = {
  Vehículos: CarFront,
  Antigüedades: Gem,
  Arte: Palette,
  Librería: BookOpen,
  Ropa: Shirt,
  Electrónica: Smartphone,
  Hogar: HomeIcon,
  Deportes: Bike,
  Donaciones: HandHeart
};

const HomePageSkeleton = () => (
  <div className="space-y-12 animate-fadeIn pt-8">
    <Skeleton className="h-80 w-full rounded-2xl" />
    <div className="main-table-container p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
     <div className="main-table-container p-6">
       <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
       <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-20 h-20 rounded-2xl" />
                <Skeleton className="h-4 w-16" />
            </div>
        ))}
       </div>
    </div>
    <Skeleton className="h-80 w-full rounded-2xl" />
  </div>
);

export default function HomePage() {
  const { categories, products, topBanners, footerBanners, isClient } = useAppContext();

  if (!isClient) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-12 animate-fadeIn pt-8">
      
      <section>
        <div className="main-table-container">
            <Carousel 
            opts={{ loop: true }}
            plugins={[
                Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                }),
            ]}
            >
            <CarouselContent>
                {topBanners.map((banner, index) => banner && (
                    <CarouselItem key={index}>
                        <Link href="#">
                            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden cursor-pointer group">
                            <Image src={banner} alt={`Banner ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="sale event" className="transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4"/>
            </Carousel>
        </div>
      </section>

      <section>
        <div className="main-table-container p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Publicaciones Recientes</h2>
                <Link href="/recent" passHref>
                  <Button variant="ghost">Ver todo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
      </section>

      <section>
        <div className="main-table-container p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Explora por Categoría</h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.name] || BookOpen;
              return (
                <Link href={`/category/${encodeURIComponent(category.name)}`} key={category.id} className="group flex flex-col items-center gap-2 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl border border-white/30">
                      <Icon className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      <section>
        <div className="main-table-container">
            <Carousel 
            opts={{ loop: true }}
            plugins={[
                Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                }),
            ]}
            >
            <CarouselContent>
                 {footerBanners.map((banner, index) => banner && (
                    <CarouselItem key={index}>
                        <Link href="#">
                            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden cursor-pointer group">
                            <Image src={banner} alt={`Footer Banner ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="featured products" className="transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4"/>
            </Carousel>
        </div>
      </section>
    </div>
  );
}
