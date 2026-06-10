import { createFileRoute } from "@tanstack/react-router";
import { requireGestionnaire } from "@/lib/route-guards";
import Page from "@/pages/gestionnaire/Personnels";

export const Route = createFileRoute("/gestionnaire/personnels")({
  beforeLoad: () => requireGestionnaire(),
  component: Page,
});
