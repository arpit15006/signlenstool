"use client";
import { useEffect, useState } from "react";
import { fetchErrors, sseUrl } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ErrorsPage() {
  const [errors, setErrors] = useState<any[]>([]);
  const [selectedError, setSelectedError] = useState<any>(null);

  useEffect(() => {
    fetchErrors().then(setErrors).catch(console.error);

    const es = new EventSource(sseUrl);
    es.addEventListener('new_error', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        setErrors(prev => [data, ...prev].slice(0, 100));
      } catch(err) {}
    });

    return () => es.close();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Errors</h1>
        <p className="text-zinc-400 mt-1">Review and debug runtime exceptions across services.</p>
      </div>

      <div className="border border-zinc-800 rounded-md bg-[#0A0A0A]">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="w-[150px] text-zinc-400">Timestamp</TableHead>
              <TableHead className="text-zinc-400">Service & Endpoint</TableHead>
              <TableHead className="w-1/2 text-zinc-400">Error Message</TableHead>
              <TableHead className="text-right text-zinc-400">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error: any) => (
              <TableRow 
                key={error.id} 
                className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                onClick={() => setSelectedError(error)}
              >
                <TableCell className="font-mono text-xs text-zinc-500">
                  {new Date(error.created_at).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">{error.service_name}</span>
                    <span className="text-xs text-zinc-500 font-mono mt-0.5">{error.endpoint || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono text-rose-400 truncate max-w-sm">
                  {error.error_message}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="destructive" className="uppercase text-[10px] tracking-wider px-2 py-0">
                    {error.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {errors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                  No errors tracked.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
        <DialogContent className="max-w-3xl bg-[#0A0A0A] border-zinc-800 text-zinc-200 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-zinc-800 bg-[#050505]">
            <Badge variant="destructive" className="w-fit mb-2">Error</Badge>
            <DialogTitle className="text-zinc-100 text-lg font-mono leading-relaxed mt-1">
              {selectedError?.error_message}
            </DialogTitle>
            <div className="flex items-center gap-4 mt-3 text-sm text-zinc-400">
              <span className="font-medium text-indigo-400">{selectedError?.service_name}</span>
              <span className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-xs">{selectedError?.endpoint || '-'}</span>
              <span>{selectedError?.created_at && new Date(selectedError.created_at).toLocaleString()}</span>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-6">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Stack Trace</h4>
            <pre className="bg-[#111] border border-zinc-800 p-4 rounded-md text-sm font-mono text-rose-400/90 whitespace-pre-wrap leading-loose">
              {selectedError?.stack_trace || "No stack trace provided."}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
