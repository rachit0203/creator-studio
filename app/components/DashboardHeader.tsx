import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardHeader() {
  const user = await currentUser();

  return (
    <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
        Authenticated session
      </p>
      <h1 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
      </h1>
      <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
        This dashboard is protected by Clerk middleware.
      </p>
    </div>
  );
}
