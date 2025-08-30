"use client";

import { ProductCard } from '@/components/product-card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';

export default function RecentProductsPage() {
  const { products } = useAppContext();
  const recentProducts = products.slice(0, 20);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
      <div className="flex items-center mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Publicaciones Recientes</h1>
      </div>
      <div className="main-table-container p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
