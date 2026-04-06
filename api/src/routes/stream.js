"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sse_1 = require("../services/sse");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    const clientId = Date.now();
    (0, sse_1.addClient)(clientId, res);
    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
    req.on("close", () => {
        (0, sse_1.removeClient)(clientId);
    });
});
exports.default = router;
//# sourceMappingURL=stream.js.map