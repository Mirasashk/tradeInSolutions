const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].filter(Boolean) as string[];

export function applyCors(
  req: { get: (name: string) => string | undefined },
  res: { set: (key: string, value: string) => void },
) {
  const origin = req.get("Origin") ?? req.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

export function handleOptions(
  req: { method?: string },
  res: { status: (code: number) => { send: (body: string) => void } },
) {
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  return false;
}
