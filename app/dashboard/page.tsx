import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import DashboardContent from "../components/DashboardContent";
import DashboardHeader from "../components/DashboardHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "Dashboard | Studio",
  description: "Your personal studio dashboard — upload assets, manage sessions, and preview Cloudinary transformations.",
};

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <PageShell>
      <main className="container-x section-y grid gap-8">
        <DashboardHeader />
        <DashboardContent />
      </main>
    </PageShell>
  );
}
