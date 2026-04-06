import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#050505] p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
