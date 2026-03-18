import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Snapbacks', to: '/shop?category=snapbacks' },
  { label: 'Athletic', to: '/shop?category=athletic' },
  { label: 'Dad Hats', to: '/shop?category=dad-hats' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();

  return (
    <header className="sticky top-[40px] z-40 bg-white transition-all duration-200"
      style={{ boxShadow: '0 -1px rgba(28,28,28,0.15) inset' }}>
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-5 px-12 py-6">
        {/* Left nav */}
        <nav className="flex items-center gap-6">
          {navLinks.slice(0, 5).map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs tracking-[0.18em] uppercase font-semibold hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link to="/" className="text-center">
          <h1 className="text-2xl tracking-[0.25em] uppercase font-bold m-0 leading-none">
            CORAM DEO SUPPLY
          </h1>
        </Link>

        {/* Right nav + icons */}
        <div className="flex items-center justify-end gap-6">
          <nav className="flex items-center gap-6">
            {navLinks.slice(5).map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs tracking-[0.18em] uppercase font-semibold hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 ml-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="bg-transparent border-none p-0 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <Link to="/account" className="hover:opacity-60 transition-opacity" aria-label="Account">
              <User size={18} />
            </Link>
            <button
              onClick={toggleCart}
              className="bg-transparent border-none p-0 relative hover:opacity-60 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[rgb(28,28,28)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="bg-transparent border-none p-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/">
          <h1 className="text-lg tracking-[0.25em] uppercase font-bold m-0">CORAM DEO SUPPLY</h1>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="bg-transparent border-none p-0"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            onClick={toggleCart}
            className="bg-transparent border-none p-0 relative"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[rgb(28,28,28)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[rgb(221,221,221)] p-4 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 border-none outline-none text-sm font-[Archivo_Narrow] tracking-wide bg-transparent"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="bg-transparent border-none p-0"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-8 overflow-y-auto"
            style={{ animation: 'slideInLeft 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-10">
              <span className="text-lg tracking-[0.25em] uppercase font-bold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="bg-transparent border-none p-0"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-[0.18em] uppercase font-semibold hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
