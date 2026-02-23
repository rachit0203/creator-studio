type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-12">
      {eyebrow ? (
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-medium tracking-[-0.02em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[520px] text-base leading-[1.65] text-[var(--color-fg-secondary)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
