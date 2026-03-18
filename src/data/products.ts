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
    id: 'athletic',
    name: 'Athletic',
    description: 'Premium athletic caps for a clean look',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
  },
  {
    id: 'dad-hats',
    name: 'Dad Hats',
    description: 'Relaxed fit unstructured caps',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
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
    description: 'Our signature black snapback with embroidered Coram Deo Supply logo. Premium wool blend construction with adjustable snap closure.',
  },
  {
    id: 'midnight-athletic',
    name: 'Midnight Athletic',
    price: 39.95,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
    category: 'athletic',
    collection: 'essentials',
    colors: ['#1c1c1c', '#1a1a2e'],
    inStock: true,
    description: 'Midnight black athletic cap with tonal embroidery. Premium cotton twill with structured crown.',
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
    id: 'navy-athletic',
    name: 'Navy Athletic',
    price: 39.95,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop',
    category: 'athletic',
    collection: 'essentials',
    colors: ['#1a1a4e', '#1c1c1c'],
    inStock: true,
    description: 'Deep navy athletic cap with white logo embroidery. Premium construction with moisture-wicking sweatband.',
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
];

export const featuredProducts = products.filter(p =>
  ['classic-black-snap', 'midnight-athletic', 'stone-dad-hat', 'red-snapback', 'navy-athletic'].includes(p.id)
);

export const newArrivals = products.filter(p => p.badge === 'NEW' || p.collection === 'color-drop');
