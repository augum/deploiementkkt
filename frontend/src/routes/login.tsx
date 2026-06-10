import { createFileRoute } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "@/lib/route-guards";
import LoginPage from "@/pages/Login";

export const Route = createFileRoute("/login")({
  beforeLoad: () => redirectIfAuthenticated(),
  component: LoginPage,
});