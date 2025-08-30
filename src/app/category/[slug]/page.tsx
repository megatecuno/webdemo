
"use client"

import { ProductCard } from '@/components/product-card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categories, products } = useAppContext();
  const categoryName = decodeURIComponent(params.slug);
  const category = categories.find(c => c.name === categoryName);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === categoryName
  );

  return (
    <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
      <div className="flex items-center mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Categoría: {categoryName}</h1>
      </div>
      <div className="main-table-container p-6">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
