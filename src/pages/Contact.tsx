import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      alert('Could not send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="px-5 md:px-8 lg:px-12 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl tracking-[0.18em] uppercase font-semibold">
            Contact Us
          </h1>
        </div>

        {sent ? (
          <div className="text-center py-12">
            <p className="text-sm tracking-[0.18em] uppercase font-semibold text-green-600">
              Message sent. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="border border-[rgb(221,221,221)] px-4 py-3.5 text-sm font-[Archivo_Narrow] tracking-wide outline-none focus:border-[rgb(28,28,28)] transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                className="border border-[rgb(221,221,221)] px-4 py-3.5 text-sm font-[Archivo_Narrow] tracking-wide outline-none focus:border-[rgb(28,28,28)] transition-colors"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              required
              rows={6}
              className="border border-[rgb(221,221,221)] px-4 py-3.5 text-sm font-[Archivo_Narrow] tracking-wide outline-none focus:border-[rgb(28,28,28)] transition-colors resize-vertical"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-[rgb(28,28,28)] text-white py-4 text-xs tracking-[0.18em] uppercase border-none hover:bg-[rgb(50,50,50)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
