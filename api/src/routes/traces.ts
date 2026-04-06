import { Router } from "express";
import { supabase } from "../supabase";
import { broadcastEvent } from "../services/sse";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { requestId, serviceName, route, totalDurationMs, statusCode, spans } = req.body;

    const { data: trace, error: traceError } = await supabase.from("traces").insert({
      request_id: requestId,
      service_name: serviceName,
      route,
      total_duration_ms: totalDurationMs,
      status_code: statusCode
    }).select().single();

    if (traceError) throw traceError;

    let mappedSpans = [];
    if (spans && Array.isArray(spans)) {
      mappedSpans = spans.map((span: any) => ({
        trace_id: trace.id,
        span_name: span.spanName,
        start_ms: span.startMs,
        duration_ms: span.durationMs,
        metadata_json: span.metadata || {}
      }));

      if (mappedSpans.length > 0) {
        const { error: spansError } = await supabase.from("trace_spans").insert(mappedSpans);
        if (spansError) throw spansError;
      }
    }

    const fullTrace = { ...trace, spans: mappedSpans };
    broadcastEvent("new_trace", fullTrace);

    res.status(201).json(fullTrace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("traces")
      .select(`
        *,
        trace_spans (*)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
