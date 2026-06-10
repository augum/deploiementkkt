import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Utilisateurs";

export const Route = createFileRoute("/admin/utilisateurs")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
