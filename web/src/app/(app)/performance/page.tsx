"use client";
import { useEffect, useState } from "react";
import { fetchTraces } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function PerformancePage() {
  const [traces, setTraces] = useState<any[]>([]);

  useEffect(() => {
    fetchTraces().then(setTraces).catch(console.error);
  }, []);

  const sortedByDuration = [...traces].sort((a, b) => a.total_duration_ms - b.total_duration_ms);
  const p95Index = Math.floor(sortedByDuration.length * 0.95);
  const p95Latency = sortedByDuration.length > 0 ? sortedByDuration[p95Index].total_duration_ms : 0;

  const serviceStats = traces.reduce((acc: any, t) => {
    if (!acc[t.service_name]) acc[t.service_name] = { total: 0, count: 0 };
    acc[t.service_name].total += t.total_duration_ms;
    acc[t.service_name].count += 1;
    return acc;
  }, {});

  const slowestService = Object.entries(serviceStats)
    .map(([name, stats]: [string, any]) => ({ name, avg: stats.total / stats.count }))
    .sort((a, b) => b.avg - a.avg)[0] || { name: "N/A", avg: 0 };

  const topSlowestRoutes = [...traces]
    .sort((a, b) => b.total_duration_ms - a.total_duration_ms)
    .slice(0, 10);

  const thresholdEndpoints = traces
    .filter(t => t.total_duration_ms > 200) 
    .sort((a, b) => b.total_duration_ms - a.total_duration_ms)
    .slice(0, 10);

  const chartData = topSlowestRoutes.map(t => ({
    route: t.route || t.service_name,
    duration: t.total_duration_ms
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Performance</h1>
        <p className="text-zinc-400 mt-1">Identify bottlenecks and optimize latency.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-[#0A0A0A] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Slowest Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 50, bottom: 0 }}>
                    <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="route" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={100} />
                    <Tooltip cursor={{ fill: '#18181b' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px' }} />
                    <Bar dataKey="duration" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                  No trace data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-[#0A0A0A] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500"/>
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
               <p className="text-sm text-zinc-400 mb-1">Global p95 Latency</p>
               <p className="text-3xl font-bold text-zinc-100">{p95Latency}ms <span className={`text-xs font-normal ml-2 ${p95Latency < 300 ? 'text-emerald-500' : 'text-rose-500'}`}>{p95Latency < 300 ? 'Healthy' : 'Degraded'}</span></p>
             </div>
             <div>
               <p className="text-sm text-zinc-400 mb-1">Slowest Service</p>
               <p className="text-xl font-semibold text-zinc-200">{slowestService.name}</p>
               <p className="text-xs text-zinc-500 mt-1">avg. {Math.round(slowestService.avg)}ms</p>
             </div>
             <div className="pt-4 border-t border-zinc-800">
               <span className="text-xs text-zinc-500">Based on recent {traces.length} sampled requests.</span>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="border border-zinc-800 rounded-md bg-[#0A0A0A] overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-[#111]">
          <h3 className="font-semibold text-zinc-100">Endpoints crossing threshold ( {'>'} 200ms )</h3>
        </div>
        <Table>
          <TableHeader className="bg-[#050505]">
            <TableRow className="border-zinc-800 hover:bg-[#050505]">
              <TableHead className="text-zinc-400">Route</TableHead>
              <TableHead className="text-zinc-400">Service</TableHead>
              <TableHead className="text-right text-zinc-400">Latency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {thresholdEndpoints.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={3} className="text-center py-6 text-zinc-500 hover:bg-[#050505]">All services running fast.</TableCell>
               </TableRow>
            ) : thresholdEndpoints.map(endpoint => (
               <TableRow key={endpoint.id} className="border-zinc-800 hover:bg-zinc-800/50">
                 <TableCell className="font-mono text-xs text-zinc-300">{endpoint.route || '-'}</TableCell>
                 <TableCell className="text-zinc-400 text-sm">{endpoint.service_name}</TableCell>
                 <TableCell className="text-right">
                    <Badge variant="outline" className={`${endpoint.total_duration_ms > 500 ? 'border-rose-500 text-rose-400' : 'border-amber-500 text-amber-400'}`}>
                      {endpoint.total_duration_ms}ms
                    </Badge>
                 </TableCell>
               </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
