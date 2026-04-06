import { Router } from "express";
import { supabase } from "../supabase";
import { broadcastEvent } from "../services/sse";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { serviceName, level, message, requestId, metadata } = req.body;

    const { data, error } = await supabase.from("logs").insert({
      service_name: serviceName,
      level: level || "info",
      message,
      request_id: requestId,
      metadata_json: metadata || {}
    }).select().single();

    if (error) throw error;

    broadcastEvent("new_log", data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
