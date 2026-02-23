import { ReactNode } from "react";
import Footer from "./Footer";
import Navigation from "./Navigation";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Navigation />
      <div className="pt-[var(--nav-height)]">{children}</div>
      <Footer />
    </div>
  );
}
