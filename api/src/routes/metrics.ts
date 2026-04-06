import { Router } from "express";
import { supabase } from "../supabase";

const router = Router();

router.get("/overview", async (req, res) => {
  try {
    const [errorsRes, tracesRes, logsRes] = await Promise.all([
      supabase.from("errors").select("id", { count: "exact", head: true }),
      supabase.from("traces").select("total_duration_ms").limit(100),
      supabase.from("logs").select("id", { count: "exact", head: true })
    ]);

    const totalErrors = errorsRes.count || 0;
    const totalLogs = logsRes.count || 0;
    const totalTraces = tracesRes.data?.length || 0;
    
    let avgLatency = 0;
    if (tracesRes.data && tracesRes.data.length > 0) {
      const sum = tracesRes.data.reduce((acc, t) => acc + (t.total_duration_ms || 0), 0);
      avgLatency = Math.round(sum / tracesRes.data.length);
    }

    res.json({ totalErrors, avgLatency, totalLogs, totalTraces });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/trend", async (req, res) => {
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data: errors, error } = await supabase
      .from("errors")
      .select("created_at")
      .filter("created_at", "gte", sixHoursAgo);

    if (error) throw error;

    const now = new Date();
    const trend = [];
    for (let i = 11; i >= 0; i--) {
       const d = new Date(now.getTime() - i * 30 * 60 * 1000);
       const h = d.getHours().toString().padStart(2, '0');
       const m = d.getMinutes() < 30 ? "00" : "30";
       const timeStr = `${h}:${m}`;
       
       const count = errors?.filter(err => {
         const ed = new Date(err.created_at);
         const isSameHour = ed.getHours() === d.getHours();
         const isCorrectBucket = m === "00" ? ed.getMinutes() < 30 : ed.getMinutes() >= 30;
         return isSameHour && isCorrectBucket;
       }).length || 0;
       
       trend.push({ time: timeStr, errors: count });
    }

    res.json(trend);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const [errors, logs, traces] = await Promise.all([
      supabase.from("errors").select("service_name, error_message, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("logs").select("service_name, message, level, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("traces").select("service_name, route, total_duration_ms, created_at").order("created_at", { ascending: false }).limit(5)
    ]);

    const activity = [
      ...(errors.data || []).map(e => ({ type: 'error', service: e.service_name, message: e.error_message, timestamp: e.created_at })),
      ...(logs.data || []).map(l => ({ type: 'log', service: l.service_name, message: l.message, level: l.level, timestamp: l.created_at })),
      ...(traces.data || []).map(t => ({ type: 'trace', service: t.service_name, message: `Slow query: ${t.route}`, duration: t.total_duration_ms, timestamp: t.created_at }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    res.json(activity);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
