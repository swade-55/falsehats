import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1600&h=800&fit=crop',
    title: 'New Season.\nNew Headwear.',
    subtitle: 'Explore the Spring 2026 collection',
    cta: 'Shop Now',
    link: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=1600&h=800&fit=crop',
    title: 'Snapback\nCollection',
    subtitle: 'Classic styles, bold statements',
    cta: 'View Collection',
    link: '/shop?category=snapbacks',
  },
  {
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1600&h=800&fit=crop',
    title: 'Dad Hats\nAre Back',
    subtitle: 'Relaxed fits for everyday wear',
    cta: 'Shop Dad Hats',
    link: '/shop?category=dad-hats',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.15em] uppercase leading-tight whitespace-pre-line m-0">
              {slide.title}
            </h2>
            <p className="mt-4 text-sm md:text-base tracking-[0.18em] uppercase opacity-80">
              {slide.subtitle}
            </p>
            <Link
              to={slide.link}
              className="mt-8 inline-block bg-white text-[rgb(28,28,28)] px-10 py-4 text-xs tracking-[0.18em] uppercase font-semibold hover:bg-gray-100 transition-colors"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none text-white p-2 transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none text-white p-2 transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full border-none transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
