import { SignIn } from "@clerk/nextjs";
import AuthShell from "../../components/AuthShell";
import PageShell from "../../components/PageShell";

export default function SignInPage() {
  return (
    <PageShell>
      <AuthShell
        title="Sign in"
        description="Access your studio dashboard, upload assets, and manage your session securely."
      >
        <SignIn appearance={{ elements: { card: "shadow-none" } }} />
      </AuthShell>
    </PageShell>
  );
}
