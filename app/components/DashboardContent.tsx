import CloudinaryUpload from "./CloudinaryUpload";

export default function DashboardContent() {
  return (
    <div className="grid gap-6">
      <CloudinaryUpload />
      <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
        <h2 className="text-[1.125rem] font-medium tracking-[-0.01em]">
          Session-ready UI
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Use this space for authenticated-only experiences like project
          dashboards, content management, or asset pipelines.
        </p>
      </div>
    </div>
  );
}
