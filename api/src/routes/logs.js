"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../supabase");
const sse_1 = require("../services/sse");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { serviceName, level, message, requestId, metadata } = req.body;
        const { data, error } = await supabase_1.supabase.from("logs").insert({
            service_name: serviceName,
            level: level || "info",
            message,
            request_id: requestId,
            metadata_json: metadata || {}
        }).select().single();
        if (error)
            throw error;
        (0, sse_1.broadcastEvent)("new_log", data);
        res.status(201).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from("logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=logs.js.map