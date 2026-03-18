import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="px-5 md:px-8 lg:px-12 py-16 md:py-20 text-center border-t border-[rgb(221,221,221)]">
      <h2 className="text-2xl md:text-3xl tracking-[0.18em] uppercase font-semibold">
        Join the Family
      </h2>
      <p className="mt-2 text-sm text-gray-500 tracking-wide max-w-md mx-auto">
        Subscribe for exclusive drops, early access, and 10% off your first order
      </p>

      {submitted ? (
        <p className="mt-8 text-sm tracking-[0.18em] uppercase font-semibold text-green-600">
          You're in. Welcome to CORAM DEO SUPPLY.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 border border-[rgb(221,221,221)] border-r-0 px-4 py-3.5 text-sm font-[Archivo_Narrow] tracking-wide outline-none focus:border-[rgb(28,28,28)] transition-colors"
          />
          <button
            type="submit"
            className="bg-[rgb(28,28,28)] text-white px-8 py-3.5 text-xs tracking-[0.18em] uppercase border border-[rgb(28,28,28)] hover:bg-[rgb(50,50,50)] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
