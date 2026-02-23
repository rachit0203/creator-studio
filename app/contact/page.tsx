import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import PublicPageShell from "../components/PublicPageShell";

export const metadata: Metadata = {
  title: "Contact | Studio",
  description: "Get in touch with the studio. Tell us about your next launch or brand moment.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PublicPageShell
        title="Contact"
        description="Tell us about your next launch or brand moment. We'll take it from there."
      />
    </PageShell>
  );
}
