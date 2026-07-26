export function StatsTrustBar() {
  const stats = [
    "28+ Years Experience",
    "Thousands of Happy Customers",
    "Same-Day Payment",
    "45-Min Process",
  ];

  return (
    <section className="bg-brand-gold/20 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 text-center text-sm font-semibold text-brand-navy md:gap-12 md:text-base">
        {stats.map((stat) => (
          <span key={stat}>{stat}</span>
        ))}
      </div>
    </section>
  );
}
