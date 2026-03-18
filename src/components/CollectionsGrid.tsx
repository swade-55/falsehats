import { Link } from 'react-router-dom';
import { collections } from '../data/products';

export default function CollectionsGrid() {
  return (
    <section className="px-5 md:px-8 lg:px-12 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl tracking-[0.18em] uppercase font-semibold">
          Shop by Category
        </h2>
        <p className="mt-2 text-sm text-gray-500 tracking-wide">
          Find your perfect fit
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/shop?category=${collection.id}`}
            className="group relative overflow-hidden aspect-square bg-gray-100"
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-lg md:text-xl tracking-[0.18em] uppercase font-semibold">
                {collection.name}
              </h3>
              <span className="mt-2 text-xs tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
