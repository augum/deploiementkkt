import { createFileRoute } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "@/lib/route-guards";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    redirectIfAuthenticated();
    if (typeof window !== "undefined") throw redirect({ to: "/login" });
  },
  component: Index,
});

// IMPORTANT: Replace this placeholder. For sites with multiple pages (About, Services, Contact, etc.),
// create separate route files (about.tsx, services.tsx, contact.tsx) — don't put all pages in this file.
function Index() {
  return null;
}
