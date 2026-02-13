// client/src/pages/Founder/Founder.jsx

export default function Founder() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 pt-24 pb-20">
      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[1.1fr_1.4fr] items-center">
          {/* Image side */}
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-amber-200/40 via-rose-100/60 to-indigo-100/50 blur-2xl opacity-80" />
            <div className="relative rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/images/founder.jpg" // update with your founder image path
                  alt="Founder portrait"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Badge strip */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 backdrop-blur">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600/80">
                    Founder & Creative Director
                  </p>
                  <p className="text-base font-semibold mt-1 text-neutral-900">
                    Abhay Tomar
                  </p>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <p>Bright Rose Atelier</p>
                  <p className="text-[11px]">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-[11px] uppercase tracking-[0.25em] text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              The Story Behind Bright Rose
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-neutral-900">
                Weaving heritage into{" "}
                <span className="text-amber-700">modern couture</span>.
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Bright Rose was born from a simple belief: handloom isn&apos;t just a fabric,
                it&apos;s a living archive of stories, people, and places. Our founder set out to
                create pieces that honour Indian craftsmanship while feeling effortless,
                sharp, and unapologetically modern.
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              From early experiments with textiles in a tiny studio to dressing clients
              across continents, every collection starts with the same questions:
              <span className="text-neutral-900 font-medium">
                {" "}Is it honest to the craft? Does it feel like you?
              </span>
              {" "}That tension between precision tailoring and raw, hand‑woven texture
              defines Bright Rose today.
            </p>

            {/* Quote card */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-sm sm:text-base text-neutral-800 italic">
                “I don&apos;t design for seasons, I design for moments — the ones you
                never want to forget and the ones that quietly change you.”
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-amber-700/80">
                — Founder&apos;s Note
              </p>
            </div>

            {/* Signature / metrics */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                  Years in craft
                </p>
                <p className="text-2xl font-semibold text-amber-700 mt-1">10+</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                  Artisans empowered
                </p>
                <p className="text-2xl font-semibold text-amber-700 mt-1">50+</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                  Cities shipped to
                </p>
                <p className="text-2xl font-semibold text-amber-700 mt-1">30+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY / TIMELINE SECTION */}
      <section className="mt-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-amber-700/80">
                Journey
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold mt-2 text-neutral-900">
                From studio sketches to global wardrobes.
              </h2>
            </div>
            <p className="text-sm text-neutral-600 max-w-md">
              Every milestone is a collaboration — with weavers, pattern‑makers,
              dyers, and the people who choose to wear Bright Rose.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 mb-2">
                2016 · The spark
              </p>
              <p className="text-sm text-neutral-700">
                The first Bright Rose pieces were stitched in a single‑room studio,
                experimenting with Kanchipuram silks and sharp, tailored silhouettes.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 mb-2">
                2019 · The atelier
              </p>
              <p className="text-sm text-neutral-700">
                A dedicated atelier in New Delhi brought together master weavers and
                a small design team, allowing true couture‑level detailing.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 mb-2">
                Today · Bright Rose
              </p>
              <p className="text-sm text-neutral-700">
                Bright Rose now ships worldwide, with each piece still cut, inspected,
                and finished by hand — one garment at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
