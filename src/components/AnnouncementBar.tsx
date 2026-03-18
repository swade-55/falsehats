import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-50 bg-[rgb(28,28,28)] text-white text-center text-xs tracking-[0.18em] uppercase py-2.5 px-4">
      <div className="animate-marquee whitespace-nowrap inline-block">
        <span className="mx-8">Free standard shipping on all orders $55+ in US</span>
        <span className="mx-8">•</span>
        <span className="mx-8">New arrivals dropping weekly</span>
        <span className="mx-8">•</span>
        <span className="mx-8">Free standard shipping on all orders $55+ in US</span>
        <span className="mx-8">•</span>
        <span className="mx-8">New arrivals dropping weekly</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-transparent border-none"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
