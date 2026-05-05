import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — LiveVenue" },
      { name: "description", content: "Log in to your LiveVenue account." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
