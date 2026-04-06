"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertOctagon, Terminal, Network, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navs = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/errors", label: "Errors", icon: AlertOctagon },
    { href: "/logs", label: "Logs", icon: Terminal },
    { href: "/traces", label: "Traces", icon: Network },
    { href: "/performance", label: "Performance", icon: Activity },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 bg-[#0A0A0A] flex flex-col h-screen text-zinc-400">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2 text-zinc-100 font-semibold text-lg tracking-tight">
        <Activity className="w-5 h-5 text-indigo-500" />
        SignalLens
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 px-2">Overview</div>
        {navs.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${pathname === n.href ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'hover:bg-zinc-900 hover:text-zinc-100'}`}
          >
            <n.icon className="w-4 h-4" />
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 flex items-center gap-2 border-t border-zinc-800 font-mono text-xs text-zinc-600">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        Engine Online
      </div>
    </div>
  );
}
