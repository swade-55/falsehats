import HeroCarousel from '../components/HeroCarousel';
import CollectionsGrid from '../components/CollectionsGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandStory from '../components/BrandStory';
import { featuredProducts, products } from '../data/products';

export default function Home() {
  const newArrivals = products.filter(p => p.badge === 'NEW' || p.collection === 'color-drop');
  const bestsellers = products.filter(p => p.badge === 'BESTSELLER' || p.collection === 'essentials');

  return (
    <main>
      <HeroCarousel />
      <FeaturedProducts
        title="Featured"
        subtitle="Our most popular styles"
        products={featuredProducts}
      />
      <CollectionsGrid />
      <BrandStory />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Fresh drops you don't want to miss"
        products={newArrivals.length > 0 ? newArrivals : products.slice(0, 6)}
      />
      <FeaturedProducts
        title="Bestsellers"
        subtitle="What everyone's wearing"
        products={bestsellers.length > 0 ? bestsellers : products.slice(3, 9)}
      />
      {/* <Newsletter /> */}
    </main>
  );
}
