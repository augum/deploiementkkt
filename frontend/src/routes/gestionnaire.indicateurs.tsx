import { createFileRoute } from "@tanstack/react-router";
import { requireGestionnaire } from "@/lib/route-guards";
import Page from "@/pages/gestionnaire/Indicateurs";

export const Route = createFileRoute("/gestionnaire/indicateurs")({
  beforeLoad: () => requireGestionnaire(),
  component: Page,
});
