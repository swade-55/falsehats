import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '../data/products';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function FeaturedProducts({ title, subtitle, products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="px-5 md:px-8 lg:px-12 py-16 md:py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl tracking-[0.18em] uppercase font-semibold m-0">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 tracking-wide">{subtitle}</p>
          )}
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-[rgb(221,221,221)] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-[rgb(221,221,221)] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <div key={product.id} className="min-w-[260px] md:min-w-[280px] snap-start flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
