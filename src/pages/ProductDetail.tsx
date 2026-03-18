import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');

  if (!product) {
    return (
      <main className="px-5 md:px-8 lg:px-12 py-20 text-center">
        <h1 className="text-2xl tracking-[0.18em] uppercase font-semibold">Product Not Found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm underline">Back to Shop</Link>
      </main>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main>
      {/* Breadcrumbs */}
      <div className="px-5 md:px-8 lg:px-12 py-4 flex items-center gap-2 text-xs text-gray-400 tracking-[0.18em] uppercase">
        <Link to="/" className="hover:text-[rgb(28,28,28)] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[rgb(28,28,28)] transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-[rgb(28,28,28)]">{product.name}</span>
      </div>

      {/* Product */}
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="aspect-square bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="px-6 md:px-12 lg:px-16 py-10 md:py-16 flex flex-col justify-center">
          {product.badge && (
            <span className={`self-start px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold mb-4 ${
              product.badge === 'SALE'
                ? 'bg-[rgb(227,44,43)] text-white'
                : product.badge === 'NEW'
                ? 'bg-[rgb(28,28,28)] text-white'
                : 'bg-gray-100 text-[rgb(28,28,28)]'
            }`}>
              {product.badge}
            </span>
          )}

          <h1 className="text-2xl md:text-3xl tracking-[0.18em] uppercase font-semibold m-0">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className={`text-lg ${product.compareAtPrice ? 'text-[rgb(227,44,43)]' : ''}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="mt-6">
              <span className="text-xs tracking-[0.18em] uppercase text-gray-500 mb-2 block">Color</span>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 ${i === 0 ? 'border-[rgb(28,28,28)]' : 'border-gray-200'} bg-transparent p-0.5`}
                  >
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: color }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center border border-[rgb(221,221,221)]">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-12 bg-transparent border-none flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-12 bg-transparent border-none flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => addItem(product, quantity)}
              className="flex-1 bg-[rgb(28,28,28)] text-white text-xs tracking-[0.18em] uppercase border-none hover:bg-[rgb(50,50,50)] transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-10 border-t border-[rgb(221,221,221)]">
            {[
              { key: 'description', label: 'Description', content: product.description },
              { key: 'details', label: 'Details', content: 'Premium construction with quality materials. Embroidered CORAM DEO SUPPLY logo. One size fits most (adjustable).' },
              { key: 'shipping', label: 'Shipping & Returns', content: 'Free shipping on orders over $55. Standard delivery 5-7 business days. Free returns within 30 days of delivery.' },
            ].map(section => (
              <div key={section.key} className="border-b border-[rgb(221,221,221)]">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === section.key ? null : section.key)}
                  className="w-full flex items-center justify-between py-4 bg-transparent border-none text-left"
                >
                  <span className="text-xs tracking-[0.18em] uppercase font-semibold">{section.label}</span>
                  <Plus size={14} className={`transition-transform ${activeAccordion === section.key ? 'rotate-45' : ''}`} />
                </button>
                {activeAccordion === section.key && (
                  <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="px-5 md:px-8 lg:px-12 py-16 md:py-20 border-t border-[rgb(221,221,221)]">
          <h2 className="text-xl tracking-[0.18em] uppercase font-semibold mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
