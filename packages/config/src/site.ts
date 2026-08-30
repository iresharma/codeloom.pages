const LOCAL_PORTS: Record<string, number> = {
  "codeloom.iresharma.com": 3000,
  "ide.codeloom.iresharma.com": 3001,
  "tui.codeloom.iresharma.com": 3002,
  "cli.codeloom.iresharma.com": 3003,
  "engine.codeloom.iresharma.com": 3004,
};

export function productUrl(host: string) {
  if (process.env.NODE_ENV !== "production") {
    const port = LOCAL_PORTS[host];
    if (port) return `http://localhost:${port}`;
  }
  return `https://${host}`;
}
