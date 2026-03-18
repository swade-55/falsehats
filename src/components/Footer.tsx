import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[rgb(28,28,28)] text-white">
      <div className="px-5 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl tracking-[0.25em] uppercase font-bold mb-6">CORAM DEO SUPPLY</h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              Premium headwear for those who refuse to blend in.
              Bold designs. Quality materials. Always authentic.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/coramdeosupply?igsh=MW5pZHRiZHVudzNzZg==" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold mb-6 opacity-40">Shop</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/shop" className="text-sm opacity-60 hover:opacity-100 transition-opacity">All Products</Link>
              <Link to="/shop?category=snapbacks" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Snapbacks</Link>
              <Link to="/shop?category=athletic" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Athletic</Link>
              <Link to="/shop?category=dad-hats" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Dad Hats</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold mb-6 opacity-40">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-sm opacity-60 hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/contact" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Contact</Link>
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase font-semibold mb-6 opacity-40">Help</h4>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">FAQ</a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Shipping</a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Returns</a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">Terms of Service</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-5 md:px-8 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs opacity-40">&copy; 2026 CORAM DEO SUPPLY. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="text-xs opacity-40">Visa</span>
          <span className="text-xs opacity-40">Mastercard</span>
          <span className="text-xs opacity-40">Amex</span>
          <span className="text-xs opacity-40">Apple Pay</span>
          <span className="text-xs opacity-40">Google Pay</span>
        </div>
      </div>
    </footer>
  );
}
