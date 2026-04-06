"use client";
import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, Clock, ServerCrash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "10:00", errors: 4 },
  { time: "10:30", errors: 2 },
  { time: "11:00", errors: 6 },
  { time: "11:30", errors: 1 },
  { time: "12:00", errors: 0 },
  { time: "12:30", errors: 7 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalErrors: 0, avgLatency: 0, totalLogs: 0, totalTraces: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(s => {
      setStats(s);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Overview</h1>
        <p className="text-zinc-400 mt-1">High-level view of system health and performance.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0A0A0A] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Errors</CardTitle>
            <ServerCrash className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{loading ? "..." : stats.totalErrors}</div>
            <p className="text-xs text-zinc-500 mt-1">System wide tracked errors</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A0A0A] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{loading ? "..." : `${stats.avgLatency}ms`}</div>
            <p className="text-xs text-zinc-500 mt-1">Global average response time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Traces</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{loading ? "..." : stats.totalTraces}</div>
            <p className="text-xs text-zinc-500 mt-1">Requests traced</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0A0A] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Logs</CardTitle>
            <AlertCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{loading ? "..." : stats.totalLogs}</div>
            <p className="text-xs text-zinc-500 mt-1">Structured logs stored</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#0A0A0A] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Error Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px' }} />
                  <Line type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-[#0A0A0A] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-rose-500"></div>
                 <div>
                   <p className="text-sm font-medium text-zinc-200">Error in user-service</p>
                   <p className="text-xs text-zinc-500">NullReferenceException</p>
                 </div>
                 <div className="ml-auto text-xs text-zinc-500">12s ago</div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
                 <div>
                   <p className="text-sm font-medium text-zinc-200">Payment Processed</p>
                   <p className="text-xs text-zinc-500">Log level: info</p>
                 </div>
                 <div className="ml-auto text-xs text-zinc-500">1m ago</div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                 <div>
                   <p className="text-sm font-medium text-zinc-200">Slow query detected</p>
                   <p className="text-xs text-zinc-500">Trace: latency 430ms</p>
                 </div>
                 <div className="ml-auto text-xs text-zinc-500">5m ago</div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
