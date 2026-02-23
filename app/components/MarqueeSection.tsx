const clients = [
  "Vercel",
  "Next.JS",
  "Linear",
  "Cursor",
  "Scale",
  "Harvey",
  "Black Forest Labs",
  "Speakeasy",
  "Krea",
  "Apollo GraphQL",
  "Cal",
  "Trunk",
  "Replicate",
  "Flox",
  "MR Beast",
  "Daylight Computer",
  "Edglrd",
  "KidSuper Studios",
  "BaseCase Capital",
  "Ranboo",
  "Warren Lotas",
  "General Catalyst",
  "Knock",
  "BaseHub",
  "Accel",
];

export default function MarqueeSection() {
  return (
    <section
      aria-label="Trusted by Visionaries - client list"
      className="relative overflow-hidden border-y border-white/5 py-12"
    >
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,#0a0a0a_0%,transparent_12%,transparent_88%,#0a0a0a_100%)]" />
      <div className="marquee-track flex items-center gap-16">
        {clients.map((client) => (
          <span
            key={`client-${client}`}
            className="text-[clamp(0.75rem,1.2vw,1rem)] text-[var(--color-fg-secondary)] transition-colors duration-200 hover:text-white"
          >
            {client}
            <span className="ml-6 align-middle text-[0.5rem] text-[var(--color-accent)] opacity-60">
              &bull;
            </span>
          </span>
        ))}
        {clients.map((client) => (
          <span
            key={`client-dup-${client}`}
            aria-hidden
            className="text-[clamp(0.75rem,1.2vw,1rem)] text-[var(--color-fg-secondary)] transition-colors duration-200 hover:text-white"
          >
            {client}
            <span className="ml-6 align-middle text-[0.5rem] text-[var(--color-accent)] opacity-60">
              &bull;
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
