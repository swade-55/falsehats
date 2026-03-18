import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      <div className="aspect-square md:aspect-auto">
        <img
          src="https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&h=800&fit=crop"
          alt="Brand story"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20 bg-[rgb(28,28,28)] text-white">
        <span className="text-xs tracking-[0.18em] uppercase opacity-60">Our Story</span>
        <h2 className="text-3xl md:text-4xl tracking-[0.18em] uppercase font-semibold mt-4 leading-tight">
          Not Your<br />Average<br />Hat Brand
        </h2>
        <p className="mt-6 text-sm leading-relaxed opacity-80 max-w-md">
          FALSEHATS was born from the idea that headwear should be more than an accessory —
          it should be a statement. Every cap we make is designed with intention, crafted with
          premium materials, and built to stand out from the crowd.
        </p>
        <p className="mt-4 text-sm leading-relaxed opacity-80 max-w-md">
          We don't follow trends. We set them. From our signature snapbacks to our limited
          edition drops, every piece carries the FALSEHATS DNA — bold, unapologetic, and
          always authentic.
        </p>
        <Link
          to="/about"
          className="mt-8 inline-block self-start border border-white px-10 py-4 text-xs tracking-[0.18em] uppercase font-semibold hover:bg-white hover:text-[rgb(28,28,28)] transition-colors"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
