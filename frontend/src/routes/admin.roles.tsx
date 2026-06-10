import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Roles";

export const Route = createFileRoute("/admin/roles")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});