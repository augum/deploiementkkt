import { createFileRoute } from "@tanstack/react-router";
import { requireGestionnaire } from "@/lib/route-guards";
import Page from "@/pages/gestionnaire/Medicaments";

export const Route = createFileRoute("/gestionnaire/medicaments")({
  beforeLoad: () => requireGestionnaire(),
  component: Page,
});
