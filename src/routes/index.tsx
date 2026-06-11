import { createFileRoute } from "@tanstack/react-router";
import { TaskApp } from "@/components/TaskApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Calm Task Manager" },
      { name: "description", content: "A minimal, calming task manager to organize your day by category with dark mode." },
      { property: "og:title", content: "Today — Calm Task Manager" },
      { property: "og:description", content: "A minimal, calming task manager to organize your day by category with dark mode." },
    ],
  }),
  component: TaskApp,
});
