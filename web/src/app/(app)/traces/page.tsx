"use client";
import { useEffect, useState } from "react";
import { fetchTraces, sseUrl } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TracesPage() {
  const [traces, setTraces] = useState<any[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<any>(null);

  useEffect(() => {
    fetchTraces().then(setTraces).catch(console.error);

    const es = new EventSource(sseUrl);
    es.addEventListener('new_trace', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        setTraces(prev => [data, ...prev].slice(0, 50));
      } catch(err) {}
    });

    return () => es.close();
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Traces</h1>
        <p className="text-zinc-400 mt-1">End-to-end request tracing and latency waterfall.</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-[45%] border border-zinc-800 rounded-md bg-[#0A0A0A] overflow-auto flex flex-col">
          <Table>
            <TableHeader className="bg-zinc-900/50 sticky top-0 z-10">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400">Route</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400 text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traces.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={3} className="text-center text-zinc-500 py-10">No traces available</TableCell>
                 </TableRow>
              )}
              {traces.map((trace: any) => (
                <TableRow 
                  key={trace.id} 
                  className={`border-zinc-800 cursor-pointer transition-colors ${selectedTrace?.id === trace.id ? 'bg-indigo-500/10' : 'hover:bg-zinc-800/50'}`}
                  onClick={() => setSelectedTrace(trace)}
                >
                  <TableCell className="font-mono text-xs text-zinc-300">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-indigo-400">{trace.service_name}</span>
                      <span>{trace.route || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trace.status_code >= 400 ? 'destructive' : 'secondary'} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                      {trace.status_code || 200}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-zinc-300">
                    {trace.total_duration_ms}ms
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex-1 border border-zinc-800 rounded-md bg-[#0A0A0A] overflow-auto p-6">
          {selectedTrace ? (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-sm">Trace:</span>
                  {selectedTrace.request_id || selectedTrace.id}
                </h3>
                <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                  <span>Service: <span className="text-zinc-200">{selectedTrace.service_name}</span></span>
                  <span>Duration: <span className="text-zinc-200">{selectedTrace.total_duration_ms}ms</span></span>
                  <span>Date: {new Date(selectedTrace.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-300">Waterfall Timeline</h4>
                {selectedTrace.trace_spans?.length > 0 ? (
                  <div className="space-y-2 relative pt-2 pb-2">
                    {selectedTrace.trace_spans.map((span: any, i: number) => {
                      const totalDur = selectedTrace.total_duration_ms || 1;
                      const leftPercent = (span.start_ms / totalDur) * 100;
                      const widthPercent = Math.max((span.duration_ms / totalDur) * 100, 1);
                      return (
                        <div key={span.id} className="relative w-full h-8 flex items-center group">
                          <div className="w-[30%] shrink-0 text-xs font-mono text-zinc-400 truncate pr-4">
                            {span.span_name}
                          </div>
                          <div className="flex-1 relative h-full bg-zinc-900/50 rounded overflow-hidden">
                            <div 
                              className="absolute h-full rounded bg-indigo-500/80 group-hover:bg-indigo-400 transition-colors flex items-center pl-2 text-[10px] text-white font-mono"
                              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                            >
                              {widthPercent > 15 ? `${span.duration_ms}ms` : ''}
                            </div>
                          </div>
                          <div className="w-12 shrink-0 text-right text-xs font-mono text-zinc-500 pl-4 group-hover:text-zinc-300">
                            {span.duration_ms}ms
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-zinc-500 text-sm">No spans recorded for this trace.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              Select a trace to view its waterfall timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
