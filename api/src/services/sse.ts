import { Response } from "express";

let clients: { id: number; res: Response }[] = [];

export const broadcastEvent = (type: string, data: any) => {
  clients.forEach((client) => {
    client.res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  });
};

export const addClient = (reqId: number, res: Response) => {
  clients.push({ id: reqId, res });
  console.log(`SSE Client connected: ${reqId}. Total active: ${clients.length}`);
};

export const removeClient = (reqId: number) => {
  clients = clients.filter((client) => client.id !== reqId);
  console.log(`SSE Client disconnected: ${reqId}. Total active: ${clients.length}`);
};
