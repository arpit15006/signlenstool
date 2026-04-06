import { Router } from "express";
import { supabase } from "../supabase";
import { broadcastEvent } from "../services/sse";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { serviceName, endpoint, errorMessage, stackTrace, severity } = req.body;
    
    // Hash pattern to create fingerprint
    const fingerprint = Buffer.from(errorMessage || "").toString("base64").substring(0, 10); 

    const { data, error } = await supabase.from("errors").insert({
      service_name: serviceName,
      endpoint,
      error_message: errorMessage,
      stack_trace: stackTrace,
      severity: severity || "error",
      fingerprint
    }).select().single();

    if (error) throw error;

    broadcastEvent("new_error", data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("errors")
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
