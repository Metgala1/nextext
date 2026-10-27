import AppShell from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import NavigationRail from "@/components/navigation-rail";

export default function Home() {
  return (
    <AppShell>
       <main className="flex min-h-screen">
       <NavigationRail />

      <section className="min-w-0 flex-1 p-6">
        <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">NexText</h1>
            <ThemeToggle />
       </header>
      </section>
        </main>
    </AppShell>
  );
}