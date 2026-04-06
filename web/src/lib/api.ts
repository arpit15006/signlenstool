export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function fetchStats() {
  const res = await fetch(`${API_URL}/metrics/overview`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchErrors() {
  const res = await fetch(`${API_URL}/errors`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch errors");
  return res.json();
}

export async function fetchLogs() {
  const res = await fetch(`${API_URL}/logs`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function fetchTraces() {
  const res = await fetch(`${API_URL}/traces`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch traces");
  return res.json();
}

export const sseUrl = `${API_URL}/stream`;
