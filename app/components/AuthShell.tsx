import { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export default function AuthShell({
  children,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="container-x section-y">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
            Account
          </p>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-4 max-w-[480px] text-base leading-[1.65] text-[var(--color-fg-secondary)]">
            {description}
          </p>
        </div>
        <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
