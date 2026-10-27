import AppShell from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  return (
    <AppShell>
      <main className="min-h-screen p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">NexText</h1>

          <ThemeToggle />
        </header>
      </main>
    </AppShell>
  );
}