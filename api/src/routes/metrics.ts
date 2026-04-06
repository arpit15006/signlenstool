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

export default router;
