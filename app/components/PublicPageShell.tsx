type PublicPageShellProps = {
  title: string;
  description: string;
};

export default function PublicPageShell({
  title,
  description,
}: PublicPageShellProps) {
  return (
    <main className="container-x section-y">
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
        Public page
      </p>
      <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-4 max-w-[640px] text-base leading-[1.65] text-[var(--color-fg-secondary)]">
        {description}
      </p>
    </main>
  );
}
