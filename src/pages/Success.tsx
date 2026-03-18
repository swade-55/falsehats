import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  return (
    <main className="px-5 md:px-8 lg:px-12 py-20 md:py-32 text-center">
      <CheckCircle size={48} className="mx-auto text-green-600 mb-6" />
      <h1 className="text-2xl md:text-3xl tracking-[0.18em] uppercase font-semibold">
        Order Confirmed
      </h1>
      <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
        Thank you for your purchase. You'll receive a confirmation email shortly
        with your order details and tracking information.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-block bg-[rgb(28,28,28)] text-white px-10 py-4 text-xs tracking-[0.18em] uppercase font-semibold hover:bg-[rgb(50,50,50)] transition-colors"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
