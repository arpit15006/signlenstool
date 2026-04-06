"use client";
import { useEffect, useState } from "react";
import { fetchLogs, sseUrl } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs().then(setLogs).catch(console.error);

    const es = new EventSource(sseUrl);
    es.onmessage = (event) => {
      if (event.type === "message") {
        try {
           // Basic handle
        } catch(e) {}
      }
    };
    es.addEventListener('new_log', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        setLogs(prev => [data, ...prev].slice(0, 100));
      } catch(err) {}
    });

    return () => es.close();
  }, []);

  const getBadgeVariant = (level: string) => {
    if (level === "error" || level === "fatal") return "destructive";
    if (level === "warn") return "secondary"; 
    return "default";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Live Logs</h1>
        <p className="text-zinc-400 mt-1">Real-time structured log stream from your services.</p>
      </div>

      <div className="border border-zinc-800 rounded-md bg-[#0A0A0A]">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="w-[150px] text-zinc-400">Timestamp</TableHead>
              <TableHead className="text-zinc-400">Level</TableHead>
              <TableHead className="text-zinc-400">Service</TableHead>
              <TableHead className="w-full text-zinc-400">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                  No logs available. Waiting for stream...
                </TableCell>
              </TableRow>
            ) : logs.map((log: any) => (
              <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-xs text-zinc-500">
                  {new Date(log.created_at).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(log.level) as any} className="uppercase text-[10px] tracking-wider px-2 py-0">
                    {log.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-300 font-medium">
                  {log.service_name}
                </TableCell>
                <TableCell className="text-[13px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
