import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorsRouter from "./routes/errors";
import logsRouter from "./routes/logs";
import tracesRouter from "./routes/traces";
import metricsRouter from "./routes/metrics";
import streamRouter from "./routes/stream";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/errors", errorsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/traces", tracesRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/stream", streamRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`🚀 SignalLens Engine running on port ${port}`);
});
