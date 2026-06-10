import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Consultation";

export const Route = createFileRoute("/admin/consultation")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
