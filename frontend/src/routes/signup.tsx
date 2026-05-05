import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — LiveVenue" },
      {
        name: "description",
        content: "Create a free LiveVenue account and start watching live.",
      },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
