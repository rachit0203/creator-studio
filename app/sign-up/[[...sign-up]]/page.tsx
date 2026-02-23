import { SignUp } from "@clerk/nextjs";
import AuthShell from "../../components/AuthShell";
import PageShell from "../../components/PageShell";

export default function SignUpPage() {
  return (
    <PageShell>
      <AuthShell
        title="Create your account"
        description="Join the studio pipeline and unlock protected collaboration spaces."
      >
        <SignUp appearance={{ elements: { card: "shadow-none" } }} />
      </AuthShell>
    </PageShell>
  );
}
