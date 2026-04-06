"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeClient = exports.addClient = exports.broadcastEvent = void 0;
const express_1 = require("express");
let clients = [];
const broadcastEvent = (type, data) => {
    clients.forEach((client) => {
        client.res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
    });
};
exports.broadcastEvent = broadcastEvent;
const addClient = (reqId, res) => {
    clients.push({ id: reqId, res });
    console.log(`SSE Client connected: ${reqId}. Total active: ${clients.length}`);
};
exports.addClient = addClient;
const removeClient = (reqId) => {
    clients = clients.filter((client) => client.id !== reqId);
    console.log(`SSE Client disconnected: ${reqId}. Total active: ${clients.length}`);
};
exports.removeClient = removeClient;
//# sourceMappingURL=sse.js.map