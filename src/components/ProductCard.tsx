import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group relative">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold ${
            product.badge === 'SALE'
              ? 'bg-[rgb(227,44,43)] text-white'
              : product.badge === 'NEW'
              ? 'bg-[rgb(28,28,28)] text-white'
              : 'bg-white text-[rgb(28,28,28)]'
          }`}>
            {product.badge}
          </span>
        )}
        {/* Quick add button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-0 left-0 right-0 bg-[rgb(28,28,28)] text-white py-3 text-xs tracking-[0.18em] uppercase border-none flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs tracking-[0.18em] uppercase font-semibold m-0 hover:opacity-60 transition-opacity">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm ${product.compareAtPrice ? 'text-[rgb(227,44,43)]' : ''}`}>
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        {/* Color swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
