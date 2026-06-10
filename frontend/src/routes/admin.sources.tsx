import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Sources";

export const Route = createFileRoute("/admin/sources")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
