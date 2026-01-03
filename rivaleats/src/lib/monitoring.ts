type ApiLog = {
  route: string;
  status: number;
  message: string;
  details?: unknown;
  meta?: Record<string, unknown>;
};

export function logApiEvent(event: ApiLog) {
  const payload = {
    level: event.status >= 500 ? "error" : "info",
    route: event.route,
    status: event.status,
    message: event.message,
    details: event.details,
    meta: event.meta,
    timestamp: new Date().toISOString(),
  };

  // Structured log for easy parsing in hosted logs (Vercel, CloudWatch, etc.).
  console.log(JSON.stringify(payload));
}
