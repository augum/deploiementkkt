import { createFileRoute } from "@tanstack/react-router";
import { requireGestionnaire } from "@/lib/route-guards";
import Page from "@/pages/gestionnaire/Cartographies";

export const Route = createFileRoute("/gestionnaire/cartographies")({
  beforeLoad: () => requireGestionnaire(),
  component: Page,
});
