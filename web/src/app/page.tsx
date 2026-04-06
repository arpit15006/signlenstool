"use client";
import Link from "next/link";
import { Activity, ArrowRight, ServerCrash, Terminal, Network, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-[#050505] flex flex-col font-sans">
      <nav className="flex items-center justify-between p-6 border-b border-zinc-900 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xl tracking-tight">
          <Activity className="w-6 h-6 text-indigo-500" />
          SignalLens
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-4 py-2 border border-indigo-500/50 text-indigo-400 rounded-md text-sm font-medium hover:bg-indigo-500/10 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <section className="py-32 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-sm">
            v1.0 is now live — Production Ready
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Observe everything. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              Debug faster.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SignalLens is the developer-first observability platform. Capture errors, stream logs, trace requests, and analyze latency bottlenecks in a unified, hyper-fast dashboard.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors rounded-md">
              Open Dashboard <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </section>

        <section className="py-24 bg-[#0A0A0A] border-y border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">A SaaS-grade observability stack built for modern teams.</h2>
                <p className="text-zinc-400 text-lg">Stop juggling five different tools. Bring your traces, logs, and errors together.</p>
              </div>
              
              <div className="grid gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    <ServerCrash className="text-rose-500 w-6 h-6"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-200 mb-2">Error Tracking</h3>
                    <p className="text-zinc-500">Capture exceptions with full stack traces, automated fingerprinting, and frequency trends.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Terminal className="text-emerald-500 w-6 h-6"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-200 mb-2">Structured Logging</h3>
                    <p className="text-zinc-500">Live SSE-streamed semantic logs. Filter instantly by severity and service architecture.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Network className="text-indigo-500 w-6 h-6"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-200 mb-2">Distributed Tracing</h3>
                    <p className="text-zinc-500">End-to-end request tracing. Visualize execution bottlenecks with high-fidelity waterfall diagrams.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                     <Clock className="text-amber-500 w-6 h-6"/>
                   </div>
                   <div>
                     <h3 className="text-xl font-semibold text-zinc-200 mb-2">Performance Metrics</h3>
                     <p className="text-zinc-500">Track high-percentile API latency and quickly isolate the exact endpoints slowing you down.</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl border border-zinc-800 bg-[#111] overflow-hidden shadow-2xl flex items-center justify-center min-h-[500px]">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="z-10 text-center">
                 <Activity className="w-20 h-20 text-indigo-500 mx-auto mb-4 animate-pulse" />
                 <h3 className="text-xl text-zinc-300 font-mono">Engine is online</h3>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-zinc-600 border-t border-zinc-900 mt-auto bg-[#050505]">
        <p className="text-sm">Built with Next.js, Express, and Supabase. © 2026 SignalLens.</p>
      </footer>
    </div>
  );
}
