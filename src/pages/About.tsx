import Newsletter from '../components/Newsletter';

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=1600&h=800&fit=crop"
          alt="About FALSEHATS"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white tracking-[0.18em] uppercase font-bold">
            About Us
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <h2 className="text-2xl tracking-[0.18em] uppercase font-semibold text-center">
          The FALSEHATS Story
        </h2>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
          <p>
            FALSEHATS started with a simple observation: the hat game was getting stale.
            Every brand was putting out the same designs, the same fits, the same energy.
            We knew there had to be something better.
          </p>
          <p>
            Founded in 2024, we set out to create headwear that breaks the mold. Every cap
            we design goes through a rigorous process — from concept sketches to material
            sourcing to final production — ensuring that what you put on your head is
            nothing short of exceptional.
          </p>
          <p>
            We work with premium manufacturers who share our obsession with quality. From the
            stitching to the embroidery, from the fabric to the hardware, every detail is
            intentional. We don't cut corners because we know you can tell the difference.
          </p>
          <p>
            FALSEHATS isn't just a brand — it's a statement. When you wear our caps, you're
            telling the world that you refuse to settle for ordinary. You're part of a
            community that values authenticity, quality, and bold self-expression.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-[rgb(28,28,28)] text-white px-5 md:px-8 lg:px-12 py-16 md:py-20">
        <h2 className="text-2xl tracking-[0.18em] uppercase font-semibold text-center mb-12">
          What We Stand For
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: 'Quality First',
              desc: 'Premium materials and construction. Every cap is built to last and look better with time.',
            },
            {
              title: 'Bold Design',
              desc: 'We don\'t follow trends — we create them. Our designs stand out because they\'re made to.',
            },
            {
              title: 'Community',
              desc: 'FALSEHATS is more than a brand. It\'s a movement of people who refuse to blend in.',
            },
          ].map(value => (
            <div key={value.title} className="text-center">
              <h3 className="text-lg tracking-[0.18em] uppercase font-semibold mb-4">{value.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
