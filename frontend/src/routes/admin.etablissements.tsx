import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/route-guards";
import Page from "@/pages/admin/Etablissements";

export const Route = createFileRoute("/admin/etablissements")({
  beforeLoad: () => requireAdmin(),
  component: Page,
});
