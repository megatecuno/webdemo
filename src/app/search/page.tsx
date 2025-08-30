
"use client";

import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { ProductCard } from '@/components/product-card';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { products } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const results = products.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
      {query ? (
        <>
          <h1 className="text-3xl font-bold mb-8">
            Resultados de búsqueda para: <span className="text-primary">&quot;{query}&quot;</span>
          </h1>
          <div className="main-table-container p-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 stats-box">
                <Search className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No se encontraron resultados</h2>
                <p className="text-muted-foreground">Intenta con otra palabra clave o explora nuestras categorías.</p>
              </div>
            )}
          </div>
        </>
      ) : (
         <div className="text-center py-20 stats-box">
            <Search className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Realiza una búsqueda</h2>
            <p className="text-muted-foreground">Escribe algo en la barra de búsqueda para encontrar productos.</p>
          </div>
      )}
    </div>
  );
}
