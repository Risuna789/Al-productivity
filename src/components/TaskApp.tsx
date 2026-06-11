import { useEffect, useMemo, useState } from "react";
import { Check, Moon, Plus, Sun, Trash2, ListTodo, Briefcase, Home, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

type Category = "personal" | "work" | "home" | "wellness";

interface Task {
  id: string;
  title: string;
  category: Category;
  done: boolean;
  createdAt: number;
}

const CATEGORIES: { id: Category; label: string; icon: typeof Briefcase }[] = [
  { id: "personal", label: "Personal", icon: Sparkles },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "home", label: "Home", icon: Home },
  { id: "wellness", label: "Wellness", icon: Heart },
];

const STORAGE_KEY = "tasks_v1";

export function TaskApp() {
  const { theme, toggle } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [filter, setFilter] = useState<Category | "all">("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((t) => [
      { id: crypto.randomUUID(), title, category, done: false, createdAt: Date.now() },
      ...t,
    ]);
    setInput("");
  };

  const toggleTask = (id: string) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const removeTask = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const filtered = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tasks.filter((t) => !t.done).length };
    CATEGORIES.forEach((cat) => {
      c[cat.id] = tasks.filter((t) => t.category === cat.id && !t.done).length;
    });
    return c;
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/60 px-3 py-1 text-xs font-medium text-accent-foreground">
              <ListTodo className="h-3.5 w-3.5" />
              {tasks.length} tasks · {completedCount} done
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Today
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A calm place to capture and complete what matters.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        <div className="mb-6 rounded-2xl border bg-card p-3 shadow-[var(--shadow-soft)]">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a new task…"
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <Button
              onClick={addTask}
              className="rounded-xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t pt-3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={counts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              count={counts[c.id]}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            />
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Nothing here yet. Add your first task above.
            </li>
          )}
          {filtered.map((task) => {
            const cat = CATEGORIES.find((c) => c.id === task.category)!;
            const Icon = cat.icon;
            return (
              <li
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-[var(--shadow-soft)] transition-all",
                  task.done && "opacity-60",
                )}
              >
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      task.done && "line-through text-muted-foreground",
                    )}
                  >
                    {task.title}
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1 rounded-full font-normal">
                  <Icon className="h-3 w-3" />
                  {cat.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(task.id)}
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>

        {completedCount > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5" />
            {completedCount} completed
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-[10px]",
          active ? "bg-primary-foreground/20" : "bg-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}
