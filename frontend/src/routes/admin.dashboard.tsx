import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Dashboard";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
