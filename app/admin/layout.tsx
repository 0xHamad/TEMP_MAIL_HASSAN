import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // If no session cookie, render the login UI (handled in page.tsx or via separate page)
  // Wait, if we enforce it here, we can't render the login form on /admin easily unless we use a separate route for login.
  // So it's better to NOT redirect here, but rather check in page.tsx and render either Login or Dashboard.
  return <>{children}</>;
}
