"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../supabase");
const router = (0, express_1.Router)();
router.get("/overview", async (req, res) => {
    try {
        const [errorsRes, tracesRes, logsRes] = await Promise.all([
            supabase_1.supabase.from("errors").select("id", { count: "exact", head: true }),
            supabase_1.supabase.from("traces").select("total_duration_ms").limit(100),
            supabase_1.supabase.from("logs").select("id", { count: "exact", head: true })
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=metrics.js.map