import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, collections } from '../data/products';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory);

    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  }, [selectedCategory, sortBy]);

  return (
    <main className="px-5 md:px-8 lg:px-12 py-10 md:py-16">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl tracking-[0.18em] uppercase font-semibold">
          {selectedCategory === 'all' ? 'All Products' : collections.find(c => c.id === selectedCategory)?.name || 'Shop'}
        </h1>
        <p className="mt-2 text-sm text-gray-500 tracking-wide">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[rgb(221,221,221)]">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400 mr-1" />
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 text-xs tracking-[0.18em] uppercase border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[rgb(28,28,28)] text-white border-[rgb(28,28,28)]'
                : 'bg-transparent text-[rgb(28,28,28)] border-[rgb(221,221,221)] hover:border-[rgb(28,28,28)]'
            }`}
          >
            All
          </button>
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => handleCategoryChange(col.id)}
              className={`px-3 py-1.5 text-xs tracking-[0.18em] uppercase border transition-colors ${
                selectedCategory === col.id
                  ? 'bg-[rgb(28,28,28)] text-white border-[rgb(28,28,28)]'
                  : 'bg-transparent text-[rgb(28,28,28)] border-[rgb(221,221,221)] hover:border-[rgb(28,28,28)]'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Sort + grid toggle */}
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-[rgb(221,221,221)] px-3 py-1.5 text-xs tracking-[0.18em] uppercase font-[Archivo_Narrow] bg-transparent outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>

          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 border transition-colors ${gridCols === 2 ? 'border-[rgb(28,28,28)]' : 'border-transparent'} bg-transparent`}
              aria-label="2 columns"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 border transition-colors ${gridCols === 3 ? 'border-[rgb(28,28,28)]' : 'border-transparent'} bg-transparent`}
              aria-label="3 columns"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 border transition-colors ${gridCols === 4 ? 'border-[rgb(28,28,28)]' : 'border-transparent'} bg-transparent`}
              aria-label="4 columns"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="2.5" height="2.5" /><rect x="5.25" y="1" width="2.5" height="2.5" />
                <rect x="9.5" y="1" width="2.5" height="2.5" /><rect x="13" y="1" width="2.5" height="2.5" />
                <rect x="1" y="6" width="2.5" height="2.5" /><rect x="5.25" y="6" width="2.5" height="2.5" />
                <rect x="9.5" y="6" width="2.5" height="2.5" /><rect x="13" y="6" width="2.5" height="2.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div
        className={`grid gap-4 md:gap-6 ${
          gridCols === 2 ? 'grid-cols-2' :
          gridCols === 3 ? 'grid-cols-2 md:grid-cols-3' :
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-gray-500 uppercase tracking-[0.18em]">No products found</p>
        </div>
      )}
    </main>
  );
}
