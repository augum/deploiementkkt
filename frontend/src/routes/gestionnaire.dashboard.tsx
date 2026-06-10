import { createFileRoute } from "@tanstack/react-router";
import { requireGestionnaire } from "@/lib/route-guards";
import Page from "@/pages/gestionnaire/Dashboard";

export const Route = createFileRoute("/gestionnaire/dashboard")({
  beforeLoad: () => requireGestionnaire(),
  component: Page,
});
