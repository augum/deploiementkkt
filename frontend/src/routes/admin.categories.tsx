import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Categories";

export const Route = createFileRoute("/admin/categories")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
