export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  collection: string;
  badge?: string;
  colors?: string[];
  inStock: boolean;
  description: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const collections: Collection[] = [
  {
    id: 'snapbacks',
    name: 'Snapbacks',
    description: 'Classic adjustable snapback caps',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop',
  },
  {
    id: 'fitted',
    name: 'Fitted',
    description: 'Premium fitted caps for a clean look',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
  },
  {
    id: 'dad-hats',
    name: 'Dad Hats',
    description: 'Relaxed fit unstructured caps',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
  },
  {
    id: 'beanies',
    name: 'Beanies',
    description: 'Warm knit beanies for cold days',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop',
  },
  {
    id: 'trucker',
    name: 'Trucker',
    description: 'Mesh back trucker caps',
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=600&fit=crop',
  },
  {
    id: 'bucket',
    name: 'Bucket Hats',
    description: 'Trendy bucket hats for all seasons',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop',
  },
];

export const products: Product[] = [
  {
    id: 'classic-black-snap',
    name: 'Classic Black Snapback',
    price: 34.95,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop',
    category: 'snapbacks',
    collection: 'essentials',
    colors: ['#1c1c1c', '#ffffff', '#c41e3a'],
    inStock: true,
    description: 'Our signature black snapback with embroidered False Hats logo. Premium wool blend construction with adjustable snap closure.',
  },
  {
    id: 'midnight-fitted',
    name: 'Midnight Fitted',
    price: 39.95,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
    category: 'fitted',
    collection: 'essentials',
    colors: ['#1c1c1c', '#1a1a2e'],
    inStock: true,
    description: 'Midnight black fitted cap with tonal embroidery. Premium cotton twill with structured crown.',
  },
  {
    id: 'stone-dad-hat',
    name: 'Stone Washed Dad Hat',
    price: 29.95,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
    category: 'dad-hats',
    collection: 'essentials',
    colors: ['#d4c5a9', '#1c1c1c', '#8b7355'],
    inStock: true,
    description: 'Relaxed fit stonewashed dad hat. Unstructured crown with brass buckle closure.',
  },
  {
    id: 'charcoal-beanie',
    name: 'Charcoal Knit Beanie',
    price: 24.95,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop',
    category: 'beanies',
    collection: 'winter',
    inStock: true,
    description: 'Soft ribbed knit beanie in charcoal. Embroidered logo patch with fold-over cuff.',
  },
  {
    id: 'forest-trucker',
    name: 'Forest Green Trucker',
    price: 32.95,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=600&fit=crop',
    category: 'trucker',
    collection: 'outdoor',
    colors: ['#2d5016', '#1c1c1c'],
    inStock: true,
    description: 'Forest green trucker cap with mesh back. Curved brim with adjustable snapback closure.',
  },
  {
    id: 'cream-bucket',
    name: 'Cream Bucket Hat',
    price: 36.95,
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop',
    category: 'bucket',
    collection: 'summer',
    colors: ['#f5f0e1', '#1c1c1c'],
    inStock: true,
    description: 'Cream canvas bucket hat with embroidered logo. Lightweight with wide brim for sun protection.',
  },
  {
    id: 'red-snapback',
    name: 'Crimson Snapback',
    price: 34.95,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop',
    category: 'snapbacks',
    collection: 'color-drop',
    badge: 'NEW',
    colors: ['#c41e3a', '#1c1c1c'],
    inStock: true,
    description: 'Bold crimson snapback from our Color Drop collection. Premium wool blend with contrast stitching.',
  },
  {
    id: 'navy-fitted',
    name: 'Navy Fitted',
    price: 39.95,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
    category: 'fitted',
    collection: 'essentials',
    colors: ['#1a1a4e', '#1c1c1c'],
    inStock: true,
    description: 'Deep navy fitted cap with white logo embroidery. Premium construction with moisture-wicking sweatband.',
  },
  {
    id: 'olive-dad-hat',
    name: 'Olive Dad Hat',
    price: 29.95,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
    category: 'dad-hats',
    collection: 'outdoor',
    colors: ['#556b2f', '#1c1c1c'],
    inStock: true,
    description: 'Military olive dad hat with vintage wash. Unstructured crown with adjustable strap.',
  },
  {
    id: 'black-beanie',
    name: 'Black Knit Beanie',
    price: 24.95,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop',
    category: 'beanies',
    collection: 'winter',
    badge: 'BESTSELLER',
    inStock: true,
    description: 'Classic black ribbed knit beanie. Woven logo label with comfortable fold-over cuff.',
  },
  {
    id: 'tan-trucker',
    name: 'Tan Trucker',
    price: 32.95,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=600&fit=crop',
    category: 'trucker',
    collection: 'summer',
    colors: ['#d2b48c', '#1c1c1c'],
    inStock: true,
    description: 'Tan front panel trucker with breathable mesh back. Perfect for warm weather.',
  },
  {
    id: 'black-bucket',
    name: 'Black Bucket Hat',
    price: 36.95,
    compareAtPrice: 44.95,
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop',
    category: 'bucket',
    collection: 'essentials',
    badge: 'SALE',
    colors: ['#1c1c1c'],
    inStock: true,
    description: 'All-black bucket hat with tonal embroidery. Premium cotton canvas construction.',
  },
];

export const featuredProducts = products.filter(p =>
  ['classic-black-snap', 'midnight-fitted', 'stone-dad-hat', 'charcoal-beanie', 'forest-trucker', 'cream-bucket'].includes(p.id)
);

export const newArrivals = products.filter(p => p.badge === 'NEW' || p.collection === 'color-drop');
